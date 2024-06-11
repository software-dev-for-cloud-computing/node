#!/bin/bash

# Create directories
mkdir -p dev4cloud/models dev4cloud/routes dev4cloud/controllers dev4cloud/config

# Create files
touch dev4cloud/models/user.js
touch dev4cloud/models/document.js
touch dev4cloud/models/tag.js
touch dev4cloud/models/conversation.js
touch dev4cloud/models/prompt.js
touch dev4cloud/models/answer.js

touch dev4cloud/routes/auth.js
touch dev4cloud/routes/users.js
touch dev4cloud/routes/documents.js
touch dev4cloud/routes/tags.js
touch dev4cloud/routes/conversations.js
touch dev4cloud/routes/prompts.js

touch dev4cloud/controllers/authController.js
touch dev4cloud/controllers/userController.js
touch dev4cloud/controllers/documentController.js
touch dev4cloud/controllers/tagController.js
touch dev4cloud/controllers/conversationController.js
touch dev4cloud/controllers/promptController.js

touch dev4cloud/config/passport.js

touch dev4cloud/app.js
touch dev4cloud/server.js

echo "Directory structure and files created successfully!"
