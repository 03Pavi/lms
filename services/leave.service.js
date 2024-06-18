const { generate_pagination_info } = require("../lib/utils");
const {
  transaction_repository_obj,
  leave_repository_obj,
} = require("../repositories");
exports.get_leaves_by_orgainisation_id = async (payload) => {
  const { uuid: organisation_id } = payload.params;
  const transaction = await transaction_repository_obj.start_transaction();
  let {
    page = "1",
    limit = "10",
    search_value = "",
    sort_column = "id",
    sort_order = "DESC",
  } = payload.query;

  try {
    let options = generate_pagination_info(
      page,
      limit,
      sort_column,
      sort_order
    );

    limit = options.limit;
    sort_order = options.sort_order;
    sort_column = options.sort_column;

    let sort_key = sort_column.sort_key;
    let offset = options.offset;
    const payload = {
      organisation_id,
      limit,
      offset,
      search_value,
      sort_column,
      sort_order,
      sort_key,
    };
    let leaves_list = await leave_repository_obj.get_leaves_by_organisation_id({
      payload,
      transaction,
    });
    if (!leaves_list) {
      return;
    }
    return {
      leaves: leaves_list,
    };
  } catch (error) {
    throw error;
  }
};
