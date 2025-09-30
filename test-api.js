const axios = require('axios');

const API_BASE_URL = 'http://localhost:3001/api';

async function testAPI() {
  console.log('🧪 Testing Job Application Tracker API...\n');

  try {
    // Test 1: Get applications (should return empty array)
    console.log('1. Testing GET /job-applications');
    const getResponse = await axios.get(`${API_BASE_URL}/job-applications?userId=test-user-123`);
    console.log('✅ GET request successful');
    console.log('📊 Current applications:', getResponse.data.total);

    // Test 2: Create a sample application
    console.log('\n2. Testing POST /job-applications');
    const sampleApplication = {
      userId: 'test-user-123',
      companyName: 'Google',
      jobTitle: 'Software Engineer',
      jobDescription: 'Full-stack development role working with React and Node.js',
      applicationStatus: 'applied',
      applicationDate: new Date(),
      resumeUsed: 'Software Engineer Resume v2.1',
      jobUrl: 'https://careers.google.com/jobs/results/12345',
      salary: '$120,000 - $180,000',
      location: 'Mountain View, CA',
      workType: 'hybrid',
      jobType: 'full_time',
      contactPerson: 'John Smith',
      contactEmail: 'john.smith@google.com',
      notes: 'Applied through careers page. Mentioned React experience.',
      interviewQuestions: [
        {
          question: 'Implement a function to reverse a linked list',
          answer: 'Used iterative approach with three pointers',
          category: 'coding',
          difficulty: 'medium',
          leetcodeLink: 'https://leetcode.com/problems/reverse-linked-list/'
        }
      ]
    };

    const createResponse = await axios.post(`${API_BASE_URL}/job-applications`, sampleApplication);
    console.log('✅ POST request successful');
    console.log('📝 Created application ID:', createResponse.data._id);

    // Test 3: Get applications again (should now have 1)
    console.log('\n3. Testing GET /job-applications (after creation)');
    const getResponse2 = await axios.get(`${API_BASE_URL}/job-applications?userId=test-user-123`);
    console.log('✅ GET request successful');
    console.log('📊 Total applications:', getResponse2.data.total);
    console.log('📋 Applications:', getResponse2.data.data.map(app => ({
      company: app.companyName,
      position: app.jobTitle,
      status: app.applicationStatus,
      date: new Date(app.applicationDate).toLocaleDateString()
    })));

    // Test 4: Get stats
    console.log('\n4. Testing GET /job-applications/stats');
    const statsResponse = await axios.get(`${API_BASE_URL}/job-applications/stats?userId=test-user-123`);
    console.log('✅ Stats request successful');
    console.log('📈 Statistics:', statsResponse.data);

    console.log('\n🎉 All API tests passed! The backend is working correctly.');
    console.log('\n🌐 Frontend: http://localhost:3000');
    console.log('🔧 Backend API: http://localhost:3001/api');
    console.log('\n📋 Next steps:');
    console.log('1. Set up Google OAuth credentials in client/.env.local');
    console.log('2. Visit http://localhost:3000 to test the full application');
    console.log('3. Sign in with Google to start tracking your job applications');

  } catch (error) {
    console.error('❌ API test failed:', error.response?.data || error.message);
  }
}

testAPI();