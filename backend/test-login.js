
require('dotenv').config();
const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api';

async function testRegister() {
  console.log('\n=== TEST REGISTRO ===');
  try {
    const response = await axios.post(`${BASE_URL}/users/register`, {
      correo: 'test@test.com',
      contraseña: '123456',
      tipo_usuario: 'freelancer'
    });
    
    console.log('✓ Registro exitoso');
    console.log('Respuesta:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    if (error.response) {
      console.log('✗ Error en registro:', error.response.data);
    } else {
      console.log('✗ Error:', error.message);
    }
  }
}

async function testLogin() {
  console.log('\n=== TEST LOGIN ===');
  try {
    const response = await axios.post(`${BASE_URL}/users/login`, {
      correo: 'test@test.com',
      contraseña: '123456'
    });
    
    console.log('✓ Login exitoso');
    console.log('Respuesta completa:', JSON.stringify(response.data, null, 2));
    
    // Verificar token
    if (response.data.token) {
      const tokenParts = response.data.token.split('.');
      console.log('\n=== ANÁLISIS DEL TOKEN ===');
      console.log('Token completo:', response.data.token);
      console.log('Partes del token:', tokenParts.length);
      console.log('Header:', tokenParts[0]);
      console.log('Payload:', tokenParts[1]);
      console.log('Signature:', tokenParts[2]);
      
      if (tokenParts.length === 3) {
        console.log('✓ Token tiene formato válido (3 partes)');
      } else {
        console.log('✗ Token INVÁLIDO - No tiene 3 partes');
      }
    } else {
      console.log('✗ NO SE RECIBIÓ TOKEN');
    }
    
    return response.data;
  } catch (error) {
    if (error.response) {
      console.log('✗ Error en login');
      console.log('Status:', error.response.status);
      console.log('Respuesta:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.log('✗ Error de red:', error.message);
    }
  }
}

async function testProtectedRoute(token) {
  console.log('\n=== TEST RUTA PROTEGIDA ===');
  try {
    const response = await axios.get(`${BASE_URL}/users/get/usuarios`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('✓ Acceso a ruta protegida exitoso');
    console.log('Usuarios encontrados:', response.data.data?.length || 0);
  } catch (error) {
    if (error.response) {
      console.log('✗ Error en ruta protegida:', error.response.data);
    } else {
      console.log('✗ Error:', error.message);
    }
  }
}

async function runTests() {
  console.log('===========================================');
  console.log('INICIANDO TESTS DE AUTENTICACIÓN');
  console.log('===========================================');
  
  // Test 1: Registro
  await testRegister();
  
  // Test 2: Login
  const loginData = await testLogin();
  
  // Test 3: Ruta protegida (si el login fue exitoso)
  if (loginData && loginData.token) {
    await testProtectedRoute(loginData.token);
  }
  
  console.log('\n===========================================');
  console.log('TESTS COMPLETADOS');
  console.log('===========================================\n');
}

// Ejecutar tests
runTests().catch(console.error);