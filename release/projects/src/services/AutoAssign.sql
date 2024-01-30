SELECT
    technician_id,
    role_id,
    appliance_ids,
    technician_name,
    distance_in_km
FROM
    (
        SELECT
            technician.user_id AS technician_id,
            technicianDetails.fullname AS technician_name,
            technicianDetails.role AS role_id,
            technician.service_lists AS appliance_ids,
            (
                6371 * ACOS(
                    COS(RADIANS('9.915706199999999')) * COS(RADIANS(technician.latitude)) * COS(
                        RADIANS(technician.longitude) - RADIANS('78.1193823')
                    ) + SIN(RADIANS('9.915706199999999')) * SIN(RADIANS(technician.latitude))
                )
            ) AS distance_in_km
        FROM
            users_details AS technician
            JOIN users AS technicianDetails ON technician.user_id = technicianDetails.id
    ) AS subquery
WHERE
    distance_in_km IS NOT NULL
    AND role_id IN (2, 3, 4, 5)
    AND appliance_ids IS NOT NULL;