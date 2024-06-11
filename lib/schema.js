const { z } = require('zod');

const { 
    leave_type_enum,
    leave_unit_enum,
    leave_period_enum,
} = require('../models');

const leave_schema = z.object({
    name: z.string({required_error: "Name is required"}),
    organisation_id: z.string({required_error: "Organisation id is required"}).uuid(),
    color: z.string().max(8, { message: "Color must be 8 or fewer characters long" }),
    code: z.string().max(3, { message: "Code must be 3 or fewer characters long" }).optional(),
    type: z.enum([leave_type_enum.PAID, leave_type_enum.UNPAID]).optional(),
    unit: z.enum([leave_unit_enum.HOUR, leave_unit_enum.DAY]).optional(),
    is_active: z.boolean().optional().default(true),
});

const leave_policy_schema = z.object({
    credit: z.number().int().optional(),
    credit_period: z.enum([leave_period_enum.YEARLY, leave_period_enum.MONTHLY]).optional(),
    reset: z.boolean().optional().default(false),
    reset_period: z.enum([leave_period_enum.YEARLY, leave_period_enum.MONTHLY]).optional(),
    carry: z.boolean().optional().default(false),
    carry_leaves: z.number().int().optional(),
    encash: z.boolean().optional().default(false),
    encash_leaves: z.number().int().optional(),
    description: z.string().optional().refine((val) => val === undefined || val.trim() !== '', { message: 'Description cannot be empty.' }),
    valid_from: z.string({ required_error: "valid_from field is required." }).datetime({ message: "Invalid \'valid_from\' datetime string! Must be UTC." }),
    valid_to: z.string().date({ message: "Invalid \'valid_to\' datetime string! Must be UTC." }).optional(),
});

const create_leave_schema = z.object({
    leave: leave_schema,
    leave_policy: leave_policy_schema
});

module.exports = {
    leave_schema,
    leave_policy_schema,
    create_leave_schema
}