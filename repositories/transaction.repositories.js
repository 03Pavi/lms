const { sequelize } = require("../config/db_connection");
class transaction_repository {

    /**
       * start_transaction method start sequelize transaction.
       * @returns {object} - To get the sequelize instance of the model
       */
    async start_transaction() {
        return sequelize.transaction();
    }

    /**
     * commit_transaction method commit sequelize transaction.
     * @param {object} transaction - To commit transaction.
     */
    async commit_transaction(transaction) {
        return transaction.commit();
    }

    /**
     * rollback_transaction method rollback sequelize transaction.
     * @param {object} transaction - To rollback transaction.
     */
    async rollback_transaction(transaction) {
        return transaction.rollback();
    }

}

module.exports = {
    transaction_repository_obj: new transaction_repository(),
};