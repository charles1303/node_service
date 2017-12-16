CREATE DATABASE IF NOT EXISTS nodeservice;

GRANT ALL PRIVILEGES on nodeservice.*
TO 'nodeservice'@'%' IDENTIFIED BY 'nodeservice'
WITH GRANT OPTION;