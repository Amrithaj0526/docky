try {
    console.log('Checking express...');
    require('express');
    console.log('Checking cors...');
    require('cors');
    console.log('Checking dotenv...');
    require('dotenv');
    console.log('Checking sequelize...');
    require('sequelize');
    console.log('Checking pg...');
    require('pg');
    console.log('Checking bcryptjs...');
    require('bcryptjs');
    console.log('Checking jsonwebtoken...');
    require('jsonwebtoken');
    console.log('Checking multer...');
    require('multer');
    console.log('All modules found!');
} catch (e) {
    console.error('Module check failed:', e.message);
    process.exit(1);
}
