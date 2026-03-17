const axios = require('axios');

async function test() {
  const baseUrl = 'http://localhost:7001/api';
  
  try {
    // 1. Create a Post first for a clean test
    console.log('Creating a test post...');
    const post_id = 'PST_' + Date.now();
    const postRes = await axios.post(`${baseUrl}/posts/create`, {
      post_id: post_id,
      user_id: 'MTR123',
      caption: 'Initial Post for Testing'
    });
    console.log('✅ Post created:', postRes.data.post.post_id);

    // 2. Add a Comment to this post
    console.log('Adding comment to the new post...');
    const commentRes = await axios.post(`${baseUrl}/posts/comment`, {
      post_id: post_id,
      user_id: 'MTR123',
      text: 'Verification Comment'
    });
    
    // Check response carefully
    if (commentRes.data.success) {
      const post = commentRes.data.post;
      const lastComment = post.comments[post.comments.length - 1];
      console.log('✅ Comment added successfully!');
      console.log('   Comment ID:', lastComment.comment_id);
      console.log('   Username:', lastComment.username);
    } else {
      console.log('❌ Comment failed:', commentRes.data.message);
    }

    // 3. Test Mentor Check with new prefix 'MTR'
    console.log('Testing mentor-only assignment create with MTR prefix...');
    const asnRes = await axios.post(`${baseUrl}/classrooms/assignment`, {
      user_id: 'MTR_NEW',
      assignment_id: 'ASN_' + Date.now(),
      classroom_id: 'CLASS_TEST',
      mentor_id: 'MTR_NEW',
      title: 'Mentor Test',
      description: 'Is MTR prefix working?',
      due_date: new Date(Date.now() + 86400000),
      enrolled_students: [],
      points: 100
    });
    console.log('✅ Assignment created by MTR_NEW:', asnRes.data.title);

  } catch (err) {
    console.error('❌ Test failed:', err.message);
    if (err.response) console.error('   Server error details:', JSON.stringify(err.response.data, null, 2));
  }
}

test();
