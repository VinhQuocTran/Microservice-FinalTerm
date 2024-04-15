CREATE DATABASE user_services_db;

USE user_services_db;

SELECT * FROM service;

SELECT * FROM submit_property;

SELECT * FROM property;

UPDATE property SET is_listed="0" WHERE id="PROPERTY_0002";

DELETE FROM service WHERE service_type="ST04";