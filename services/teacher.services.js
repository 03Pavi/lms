const { teacher_repository_obj } = require("../repositories");

exports.get_teacher_detail = async (payload) => {
    let { email_id = '' } = payload.params;
    try {
        console.log('teacher email -> ', email_id);
        let teacher = await teacher_repository_obj.get_teacher_detail({email_id});
        if(!teacher) { 
            throw Object.assign(new Error(), {name:"NOT_FOUND", message:"Teacher Detail Not Found"});
        }
        teacher = teacher.toJSON();
        const {firstname,lastname, ...teacher_details} = teacher;
        return teacher_details;
    } catch(error) {
        throw error
    }
}