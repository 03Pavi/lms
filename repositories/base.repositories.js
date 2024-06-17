/* eslint-disable snakecasejs/snakecasejs */
exports.base_repository = class base_repository {
  constructor({ db_connection, model }) {
    this.db_connection = db_connection;
    this.model = model;
  }

  /**
   * The create method create database entries.
   * @param {object} payload - To define which attributes can be set in the create method.
   * @param {object} options - If you really want to let the query restrict the model data.
   */
  async create(payload, options) {
    const instance = await this.model.create(payload, options);
    return instance;
  }

  async find_create_find({ criteria, payload, transaction, include, attributes }) {

    const options ={
      where: criteria,
      defaults: payload,
      transaction
    }

    if (include) {
      options.include = include;
    }

    if (attributes) {
      options.attributes = attributes;
    }

    const [instance, created] = await this.model.findCreateFind(options);

    return instance;
  }

  /**
   * The create method create database entries.
   * @param {object} payload - To define which attributes can be set in the create method.
   * @param {object} options - If you really want to let the query restrict the model data.
   */
  async bulk_create(payload, options = {}) {
    // options.validate = true;
    const instance = await this.model.bulkCreate(payload, options);
    return instance;
  }

  /**
   * The update method update database entries.
   * @param {object} criteria - To update records with criteria.
   * @param {object} payload - To update which attributes can be set in this method.
   * @param {array} include - To update records with association.
   */
  async update(criteria, payload, fields, transaction) {

    const options =  {
      where: criteria,
      returning: fields
    }

    if(transaction) {
      options.transaction = transaction
    }

    const [updatedRowCount, updatedRows] = await this.model.update(payload, options);
    return { updated_row_count: updatedRowCount, updated_rows: updatedRows };
  }

    /**
   * The upsert method update or insert database entries.
   * @param {object} payload - To define which attributes can be set in the upsert method.
   * @param {object} transaction - To update with transaction.
   */
  async upsert(payload, transaction) {
    let options = { transaction };
    
    const [instance] = await this.model.upsert(payload, options);
    return instance;
  }

  /**
   * The findOne method obtains the first entry it finds.
   * @param {object} criteria - To find records with criteria.
   * @param {array} include - To find records with association.
   * @param {boolean} paranoid - If you really want to let the query see the soft-deleted records, you can pass the paranoid: false option to the query method
   * @param {object} attributes - To exclude or include column in records.
   */
  async find_one(criteria, include = [], paranoid = true, attributes, transaction) {

    const options = {
      where: criteria,
      include: include,
      paranoid,
      attributes,
      transaction
    };

    return await this.model.findOne(options);
  }

  /**
   * The findAll method generates a standard SELECT query which will retrieve all entries from the table
   * @param {object} criteria - To find records with criteria.
   * @param {array} include - To find records with association.
   * @param {boolean} paranoid - If you really want to let the query see the soft-deleted records, you can pass the paranoid: false option to the query method
   * @param {object} attributes - To exclude or include column in records.
   * @param {array} order - Specifies the order of the returned records.
   * @param {number} limit - Limits the number of returned records.
   * @param {object} transaction - Transaction object to run query under.
   * @param {object|array} replacements - Replacements for query parameters to prevent SQL injection.
   */
  async find_all({criteria, include = [], paranoid = true, attributes, order, limit, transaction, replacements}) {

    const options = {
      where: criteria,
      include: include,
      paranoid,
      attributes,
      order,
      limit,
      transaction,
      replacements
    };

    return await this.model.findAll(options);
  }

  /**
   * The findAndCountAll method generates a standard SELECT query which will retrieve all entries from the table with total count
   * @param {object} criteria - To find records with criteria.
   * @param {array} include - To find records with association.
   * @param {number} [offset=0] - To skip 0 instances/rows 
   * @param {number} [limit=10] - To fetch 10 instances/rows
   * @param {array[column, direction]} order - Will return `updated_at` DESC
   * @param {boolean} paranoid - If you really want to let the query see the soft-deleted records, you can pass the paranoid: false option to the query method
   * @param {object} attributes - To exclude or include column in records.
   * @param {object|array} replacements - Replacements for query parameters to prevent SQL injection.
   */
  async find_and_count_all(criteria, include = [], offset = 0, limit = 10, paranoid = true, attributes, order, replacements) {
    
    const options = {
      where: criteria,
      include: include,
      offset,
      limit,
      paranoid,
      distinct: true,
      attributes,
      replacements
    };

    if (order) {
        options.order = order;
    }
    
    return await this.model.findAndCountAll(options);
  }

    /**
   * When you call the destroy method, a soft-deletion will happen:
   * @param {object} criteria - To destroy records with criteria.
   * @param {boolean} force - If you really want a hard-deletion and your model is paranoid, you can force it using the force: true option:
   * @param {array} include - To destroy records with association.
   * @param {object} transaction - To update with transaction.
   * @param {array} returning - To return columns after destroy.
   */
    async destroy(criteria, force = false, include, transaction, returning = ['*']) {
      return await this.model.destroy({ where: criteria, force, include, transaction, returning });
    }

};
