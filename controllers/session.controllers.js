const { session_service } = require('../services');
const { handle_error } = require('../lib/error_handler');

exports.get_attendance_list = async (req, res) => {
    try {
        const response = await session_service.get_attendance_list(req);
        
        if(!response) {
            return res.status(204).json({message:"No content found"});
        }

        return res.status(200).send(response);
    } catch (error) {
        console.log("Error while getting attendance list: ", error);
        handle_error(res, error);
    }
}

exports.get_student_list = async (req, res) => {
    try {
        const response = await session_service.get_student_list(req);
        
        if(!response) {
            return res.status(204).json({message:"No content found"});
        }

        return res.status(200).send(response);
    } catch (error) {
        console.log("Error while getting student list: ", error);
        handle_error(res, error);
    }
}

exports.create_attendances = async (req, res) => {
    try {
        const response = await session_service.create_attendances(req);
        return res.status(201).send(response);
    } catch (error) {
        console.log("Error while creating attendances: ", error);
        handle_error(res, error);
    }
}

exports.update_attendances = async (req, res) => {
    try {
        const response = await session_service.create_attendances(req);
        return res.status(200).send(response);
    } catch (error) {
        console.log("Error while updating attendances: ", error);
        handle_error(res, error);
    }
}

exports.update_session = async (req, res) => {
    try {
        const response = await session_service.update_session(req);
        return res.status(200).send(response);
    } catch (error) {
        console.log("Error while updating session: ", error);
        handle_error(res, error);
    }
}

exports.create_justification = async (req, res) => {
    try {
        const response = await session_service.create_justification(req);
        return res.status(201).send(response);
    } catch (error) {
        console.log("Error while creating justification: ", error);
        handle_error(res, error);
    }
}

exports.update_justification = async (req, res) => {
    try {
        const response = await session_service.create_justification(req);
        return res.status(200).send(response);
    } catch (error) {
        console.log("Error while updating justification: ", error);
        handle_error(res, error);
    }
}

exports.delete_justification = async (req, res) => {
    try {
        const response = await session_service.delete_justification(req);
        return res.status(200).send(response);
    } catch (error) {
        console.log("Error while deleting justification: ", error);
        handle_error(res, error);
    }
}

exports.get_upload_url = async (req, res) => {
    try {
        const response = await session_service.get_upload_url(req);
        return res.status(200).send(response);
    } catch (error) {
        console.log("Error while getting upload url: ", error);
        handle_error(res, error);
    }
}

exports.get_read_url = async (req, res) => {
    try {
        const response = await session_service.get_read_url(req);
        return res.status(200).send(response);
    } catch (error) {
        console.log("Error while getting read url: ", error);
        handle_error(res, error);
    }
}