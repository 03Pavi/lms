export const dummyData = [
    {
        "leave": {
            "uuid": "6d8445ca-a89f-441a-a2d9-1e16c8acc649",
            "name": "Annual Leave",
            "organisation_id": "a19a58ab-fe3f-4481-aeb5-3b6b26c9d30d",
            "code": "AL",
            "color": "#FF5733",
            "type": "paid",
            "unit": "day",
            "is_active": true,
            "created_at": "2024-06-18T00:00:00.000Z",
            "updated_at": "2024-06-18T00:00:00.000Z"
        },
        "leave_policy": {
            "uuid": "5d87fdaa-74cb-4065-8345-c690d28d9cf9",
            "leave_id": 1,
            "credit": 10,
            "credit_period": "monthly",
            "reset": true,
            "reset_period": "yearly",
            "carry_leaves": 5,
            "encash_leaves": 2,
            "description": "Annual Leave Policy",
            "valid_from": "2024-06-18T00:00:00.000Z",
            "created_at": "2024-06-18T00:00:00.000Z",
            "updated_at": "2024-06-18T00:00:00.000Z"
        },
        "applicabilities": [
            {
                "criteria": "Location",
                "value": "India",
                "created_at": "2024-06-18T00:00:00.000Z",
                "updated_at": "2024-06-18T00:00:00.000Z"
            },
            {
                "criteria": "Department",
                "value": "Engineering",
                "created_at": "2024-06-18T00:00:00.000Z",
                "updated_at": "2024-06-18T00:00:00.000Z"
            }
        ],
        "exceptions": [
            {
                "criteria": "genders",
                "value": "male",
                "created_at": "2024-06-18T00:00:00.000Z",
                "updated_at": "2024-06-18T00:00:00.000Z"
            },
            {
                "criteria": "genders",
                "value": "female",
                "created_at": "2024-06-18T00:00:00.000Z",
                "updated_at": "2024-06-18T00:00:00.000Z"
            },
            {
                "criteria": "genders",
                "value": "other",
                "created_at": "2024-06-18T00:00:00.000Z",
                "updated_at": "2024-06-18T00:00:00.000Z"
            }
        ],
        "restriction": {
            "uuid": "123e4567-e89b-12d3-a456-426614174000",
            "leave_policy_id": 1,
            "allow_exceed": false,
            "exceed_limit": "without_limit",
            "excess_as_lop": false,
            "sandwich_leave": false,
            "sandwich_weekend": 0,
            "sandwich_holiday": 0,
            "full_day": true,
            "half_day": false,
            "quarter_day": false,
            "hourly": false,
            "allow_past_requests": false,
            "past_request_limit": 0,
            "allow_future_requests": true,
            "next_days_limit": 30,
            "advance_days_limit": 90,
            "admin_only": false,
            "min_leave_per_request": 1,
            "max_leave_per_request": 30,
            "max_consecutive_days": 30,
            "min_gap_between_requests": 7,
            "max_requests_in_period": 12,
            "period_type": "year",
            "created_at": "2024-06-18T00:00:00.000Z",
            "updated_at": "2024-06-18T00:00:00.000Z",
            "clubbed_leaves": [
                "123e4567-e89b-12d3-a456-426614174001"
            ]
        }
    },
    {
        "leave": {
            "uuid": "6f2bd494-42e9-4431-8b26-11b29daf3722",
            "name": "Sick Leave",
            "organisation_id": "a19a58ab-fe3f-4481-aeb5-3b6b26c9d30d",
            "code": "SL",
            "color": "#2cd15f",
            "type": "paid",
            "unit": "day",
            "is_active": true,
            "created_at": "2024-01-20T23:56:35Z",
            "updated_at": "2023-09-05T11:24:29Z"
        },
        "leave_policy": {
            "uuid": "5d87fdaa-74cb-4065-8345-c590d28d9df9",
            "leave_id": 2,
            "credit": 10,
            "credit_period": "monthly",
            "reset": true,
            "reset_period": "yearly",
            "carry_leaves": 5,
            "encash_leaves": 2,
            "description": "Sick Leave Policy",
            "valid_from": "2024-06-18T00:00:00.000Z",
            "created_at": "2024-06-18T00:00:00.000Z",
            "updated_at": "2024-06-18T00:00:00.000Z"
        },
        "applicabilities": {
            "criteria": "Role",
            "value": "Australia",
            "created_at": "2024-02-18T01:27:40Z",
            "updated_at": "2023-12-08T11:09:39Z"
        },
        "exceptions": {
            "criteria": "tenure",
            "value": "female",
            "created_at": "2024-04-19T06:39:01Z",
            "updated_at": "2023-12-09T15:38:38Z"
        },
        "restriction": {
            "uuid": "123e4567-e89b-12d3-a456-425614175000",
            "leave_policy_id": 2,
            "allow_exceed": false,
            "exceed_limit": "without_limit",
            "excess_as_lop": false,
            "sandwich_leave": false,
            "sandwich_weekend": 0,
            "sandwich_holiday": 0,
            "full_day": true,
            "half_day": false,
            "quarter_day": false,
            "hourly": false,
            "allow_past_requests": false,
            "past_request_limit": 0,
            "allow_future_requests": true,
            "next_days_limit": 30,
            "advance_days_limit": 90,
            "admin_only": false,
            "min_leave_per_request": 1,
            "max_leave_per_request": 30,
            "max_consecutive_days": 30,
            "min_gap_between_requests": 7,
            "max_requests_in_period": 12,
            "period_type": "year",
            "created_at": "2024-06-18T00:00:00.000Z",
            "updated_at": "2024-06-18T00:00:00.000Z",
            "clubbed_leaves": [
                "123e4567-e89b-12d3-a456-446614174002"
            ]
        }
    }
]