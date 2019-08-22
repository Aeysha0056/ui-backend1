const mongoose = require("mongoose");

const Tab = require("../../models/ui/tab");
const Section = require("../../models/ui/section");
const Value = require("../../models/ui/value");
const View = require("../../models/ui/view");

module.exports = {
  tabs: () => {
    return Tab.find()
      .populate({
        path: "section",
        populate: {
          path: "values",
          populate: {
            path: "view"
          }
        }
      })
      .then(tabs => tabs)
      .catch(err => {
        throw err;
      });
  },
  sections: () => {
    return Section.find()
      .populate({
        path: "values",
        populate: {
          path: "view"
        }
      })
      .then(sections => sections)
      .catch(err => {
        throw err;
      });
  },
  values: () => {
    return Value.find()
      .populate({
        path: "view"
      })
      .then(values => values)
      .catch(err => {
        throw err;
      });
  },
  views: () => {
    return View.find()
      .then(views => views)
      .catch(err => {
        throw err;
      });
  },
  // find
  tab: args => {
    if (mongoose.Types.ObjectId.isValid(args.id)) {
      return Tab.findById(args.id, (err, doc) => {
        if (err) {
          throw new Error("Something wrong");
        } else {
          return doc;
        }
      }).populate({
        path: "section",
        populate: {
          path: "values",
          populate: {
            path: "view"
          }
        }
      });
    } else {
      throw new Error("id not correct");
    }
  },
  section: args => {
    if (mongoose.Types.ObjectId.isValid(args.id)) {
      return Section.findById(args.id, (err, doc) => {
        if (err) {
          throw new Error("Something wrong");
        } else {
          return doc;
        }
      }).populate({
        path: "values",
        populate: {
          path: "view"
        }
      });
    } else {
      throw new Error("id not correct");
    }
  },
  value: args => {
    if (mongoose.Types.ObjectId.isValid(args.id)) {
      return Value.findById(args.id, (err, doc) => {
        if (err) {
          throw new Error("Something wrong");
        } else {
          return doc;
        }
      }).populate({
        path: "view"
      });
    } else {
      throw new Error("id not correct");
    }
  },
  view: args => {
    if (mongoose.Types.ObjectId.isValid(args.id)) {
      return View.findById(args.id, (err, doc) => {
        if (err) {
          throw new Error("Something wrong");
        } else {
          return doc;
        }
      });
    } else {
      throw new Error("id not correct");
    }
  },
  // edit and edit
  addTab: args => {
    return new Tab({
      name: args.name
    })
      .save()
      .then(result => result)
      .catch(err => {
        throw err;
      });
  },
  editTab: args => {
    return Tab.findByIdAndUpdate(
      mongoose.Types.ObjectId(args.id),
      {
        name: args.name
      },
      { new: true }
    )
      .then(res => {
        if (!res) {
          throw new Error("tab not found");
        }
        return res;
      })
      .catch(err => {
        throw err;
      });
  },
  addSection: args => {
    return Tab.findById(args.tabId)
      .then(tab => {
        return new Section({
          name: args.name,
          type: args.type
        })
          .save()
          .then(section => {
            // add the section to the tab section
            tab.section = section;
            tab.save();
            return section;
          })
          .catch(err => {
            throw err;
          });
      })
      .catch(err => {
        throw err;
      });
  },
  editSection: args => {
    let params = { ...args };
    delete params.id;

    return Section.findByIdAndUpdate(args.id, params, { new: true })
      .then(res => {
        if (!res) {
          throw new Error("Section not found");
        }
        return res;
      })
      .catch(err => {
        throw err;
      });
  },
  addValue: args => {
    return Section.findById(args.sectionId)
      .then(section => {
        return new Value({
          name: args.name
        })
          .save()
          .then(value => {
            section.values.push(value);
            section.save();
            return value;
          })
          .catch(err => {
            throw err;
          });
      })
      .catch(err => {
        throw err;
      });
  },
  editValue: args => {
    let params = { ...args };
    delete params.id;

    return Value.findByIdAndUpdate(args.id, params, { new: true })
      .then(res => {
        if (!res) {
          throw new Error("Value not found");
        }
        return res;
      })
      .catch(err => {
        throw err;
      });
  },
  addView: args => {
    return Value.findById(args.valueId)
      .then(value => {
        return new View({
          type: args.type,
          values: args.values
        })
          .save()
          .then(view => {
            value.view = view;
            value.save();
            return view;
          })
          .catch(err => {
            throw err;
          });
      })
      .catch(err => {
        throw err;
      });
  },
  editView: args => {
    let params = { ...args };
    delete params.id;

    return View.findByIdAndUpdate(args.id, params, { new: true })
      .then(res => {
        if (!res) {
          throw new Error("View not found");
        }
        return res;
      })
      .catch(err => {
        throw err;
      });
  }
};
