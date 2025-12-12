/** @format */

class BaseService {
  constructor(model) {
    this.model = model;
  }

  // =====================
  // FIND ALL
  // =====================

  findAll = async (condition = {}) =>
    this.model.find({ ...condition, isDeleted: { $ne: true } });

  findAllWithSort = async (condition = {}, sort = {}) =>
    this.model.find({ ...condition, isDeleted: { $ne: true } }).sort(sort);

  // =====================
  // RECURSIVE
  // =====================

  findAllRecursive = async (parentField) => {
    const parent = await this.model.find({
      [parentField]: null,
      isDeleted: { $ne: true },
    });

    const getChildren = async (nodes) =>
      Promise.all(
        nodes.map(async (node) => {
          const children = await this.model.find({
            [parentField]: node._id,
            isDeleted: { $ne: true },
          });

          return {
            ...node.toObject(),
            child: children.length ? await getChildren(children) : [],
          };
        })
      );

    return getChildren(parent);
  };

  findAllRecursiveByCondition = async (condition, parentField) => {
    try {
      const parent = await this.model.find({
        ...condition,
        isDeleted: { $ne: true },
      });

      const getChildren = async (nodes) =>
        Promise.all(
          nodes.map(async (node) => {
            const children = await this.model.find({
              [parentField]: node._id,
              isDeleted: { $ne: true },
            });

            return {
              ...node.toObject(),
              child: children.length ? await getChildren(children) : [],
            };
          })
        );

      return getChildren(parent);
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  // =====================
  // DELETED
  // =====================

  findAllDeleted = async () => this.model.find({ isDeleted: true });

  // =====================
  // PAGINATION
  // =====================

  findAllWithPagination = async (condition, { page = 1, limit = 10, sort }) => {
    const data = await this.model
      .find({ ...condition, isDeleted: { $ne: true } })
      .sort(sort);

    const total = data.length;
    const pages = Math.ceil(total / limit);

    return {
      data: data.slice((page - 1) * limit, page * limit),
      metaData: { pages, total, currentPage: page },
    };
  };

  findAllAndPopulate = async (condition, populate) =>
    this.model
      .find({ ...condition, isDeleted: { $ne: true } })
      .populate(populate);

  // =====================
  // FIND ONE
  // =====================

  findById = async (id) => this.model.findById(id);

  findByIdPopulate = async (id, populate) =>
    this.model.findById(id).populate(populate);

  findOneByCondition = async (condition) =>
    this.model.findOne({ ...condition, isDeleted: { $ne: true } });

  findOneByConditionAndPopulate = async (condition, populate) =>
    this.model
      .findOne({ ...condition, isDeleted: { $ne: true } })
      .populate(populate);

  // =====================
  // DELETE
  // =====================

  hardDelete = async (condition) => this.model.findOneAndDelete(condition);

  softDelete = async (condition, user) =>
    this.model.findOneAndUpdate(
      condition,
      { isDeleted: true, deletedBy: user },
      { new: true }
    );

  softDeleteRecursive = async (parentField, condition, user) => {
    try {
      const parent = await this.model.findOneAndUpdate(
        condition,
        { isDeleted: true, deletedBy: user },
        { new: true }
      );

      const getChildren = async (parentId) => {
        const children = await this.model.find({ [parentField]: parentId });

        return Promise.all(
          children.map(async (child) => {
            await this.model.findByIdAndUpdate(child._id, {
              isDeleted: true,
              deletedBy: user,
            });

            return {
              ...child.toObject(),
              child: await getChildren(child._id),
            };
          })
        );
      };

      return getChildren(parent._id);
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  hardDeleteMany = async (condition) => this.model.deleteMany(condition);

  // =====================
  // UPDATE
  // =====================

  update = async (condition, data, returnNew = true) =>
    this.model.findOneAndUpdate(condition, data, { new: returnNew });

  updateBySoftDelete = async (condition, data, req) => {
    await this.model.findOneAndUpdate(condition, {
      isDeleted: true,
      deletedBy: req.admin?.userName,
    });

    return this.createObject(data);
  };

  updateAll = async (condition, data) => this.model.updateMany(condition, data);

  restoreSoftDelete = async (condition) =>
    this.model.findOneAndUpdate(
      condition,
      { isDeleted: false, deletedBy: "" },
      { new: true }
    );

  // =====================
  // CREATE
  // =====================

  createObject = async (data) => {
    const obj = new this.model(data);
    return obj.save();
  };
}

module.exports = BaseService;
