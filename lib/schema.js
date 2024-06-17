const { z } = require('zod');

const { 
    leave_type_enum,
    leave_unit_enum,
    leave_period_enum,
    exceed_limit_enum,
    period_type_enum
} = require('../models');

const leave_schema = z.object({
    name: z.string({required_error: "Name is required"}).min(1),
    organisation_id: z.string({required_error: "Organisation id is required"}).uuid(),
    color: z.string().max(8, { message: "Color must be 8 or fewer characters long" }).min(1),
    code: z.string().max(3, { message: "Code must be 3 or fewer characters long" }).min(1).optional(),
    type: z.enum(leave_type_enum.get_available_leave_types(), {message: 'Invalid leave type value'}),
    unit: z.enum(leave_unit_enum.get_available_leave_units(), {message: 'Invalid leave unit value'}),
    is_active: z.boolean().optional().default(true),
});

const leave_policy_schema = z.object({
    credit: z.number().int().optional().transform((val) => val < 0 ? 0 : val),
    credit_period: z.enum(leave_period_enum.get_available_periods()).optional(),
    reset: z.boolean().optional().default(false),
    reset_period: z.enum(leave_period_enum.get_available_periods()).optional(),
    carry: z.boolean().optional().default(false),
    carry_leaves: z.number().int().optional(),
    encash: z.boolean().optional().default(false),
    encash_leaves: z.number().int().optional(),
    description: z.string().optional().refine((val) => val === undefined || val.trim() !== '', { message: 'Description cannot be empty.' }),
    valid_from: z.string({ required_error: "valid_from field is required." }).datetime({ message: "Invalid \'valid_from\' datetime string! Must be UTC." }),
    valid_to: z.string().date({ message: "Invalid \'valid_to\' datetime string! Must be UTC." }).optional(),
}).superRefine((data, ctx) => {
    data.carry_leaves = data.carry === false ? 0 : data.carry_leaves;
    data.encash_leaves = data.encash === false ? 0 : data.encash_leaves;
});

const leave_applicability_object_schema = z.object({
    criteria: z.string({ required_error: 'Criteria is required' }).min(1),
    value: z.string({ required_error: 'Value is required' }).min(1)
})
  
const leave_applicability_schema = z.array(leave_applicability_object_schema).optional();

const leave_restriction_schema = z.object({
    allow_exceed: z.boolean().optional().default(false),
    exceed_limit: z.enum(exceed_limit_enum.get_available_exceed_limits(), {message: 'Invalid exceed limit value'}),
    excess_as_lop: z.boolean().optional().default(false),
    sandwich_leave: z.boolean().optional().default(false),
    sandwich_weekend: z.number().int().optional(),
    sandwich_holiday: z.number().int().optional(),
    clubbed_leaves: z.array(z.string().uuid().optional()).optional(),
    full_day: z.boolean().default(false),
    half_day: z.boolean().default(false),
    quarter_day: z.boolean().default(false),
    hourly: z.boolean().default(false),
    allow_past_requests: z.boolean().default(false),
    past_request_limit: z.number().int().optional(),
    allow_future_requests: z.boolean().default(true),
    next_days_limit: z.number().int().optional(),
    advance_days_limit: z.number().int().optional(),
    admin_only: z.boolean().default(false),
    min_leave_per_request: z.number().int().optional(),
    max_leave_per_request: z.number().int().optional(),
    max_consecutive_days: z.number().int().optional(),
    min_gap_between_requests: z.number().int().optional(),
    max_requests_in_period: z.number().int().optional(),
    period_type: z.enum(period_type_enum.get_available_periods()).optional(),
}).superRefine((data, ctx) => {    
    if(data.allow_past_requests == false) data.past_request_limit = undefined;
    if(data.allow_future_requests == false) {
        data.next_days_limit = undefined;
        data.advance_days_limit = undefined;
    }
});

const create_leave_schema = z.object({
    leave: leave_schema,
    leave_policy: leave_policy_schema,
    applicabilities: leave_applicability_schema,
    exceptions: leave_applicability_schema,
    restriction: leave_restriction_schema
});

module.exports = {
    leave_schema,
    leave_policy_schema,
    create_leave_schema,
    leave_applicability_schema,
    leave_applicability_object_schema,
    leave_restriction_schema
}