// ui models
const Tab = require("../../models/ui/tab");
const Section = require("../../models/ui/section");
const Value = require("../../models/ui/value");
const View = require("../../models/ui/view");

module.exports = {
  tabs: () => {
    // read data
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
      .then(tabs => {
        return tabs.map(tab => {
          return {
            ...tab._doc,
            section: {
              ...tab._doc.section._doc
            }
          };
        });
      })
      .catch(err => {
        throw err;
      });
  }
}
