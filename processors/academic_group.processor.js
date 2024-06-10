const { academic_group_service } = require('../services');

const create_academic_group = async (payload) => {
  const {academic_group = {}} = payload
  try {
    const response = await academic_group_service.create_academic_group(academic_group);
    if (!response) {
      throw new Error('Academic group could not be created.', academic_group);
    }
  } catch (error) {
    console.log(`educational-planning.attendance-control Error ouccered during Group configured: ${error.message}`, '\n');
    throw error;
  }
};

const create_academic_group_students = async (payload) => {
  try {
    const response = await academic_group_service.create_academic_group_students(payload);
    if (!response) {
      throw new Error(`Students assigned to a group cannot be processed. Payload: ${JSON.stringify(payload)}`);
    }
  } catch (error) {
    console.log(`educational-planning.attendance-control Error during assigning students to academic group: ${error.message}`, '\n');
    throw error;
  }
};

module.exports = {
  create_academic_group,
  create_academic_group_students
};

