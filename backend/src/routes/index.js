const UserRouter = require('./UserRouter')
const ProductRouter = require('./ProductRouter')
const AddressRouter = require('./AddressRouter')
const LocationRouter = require('./LocationRouter')
const MessageRouter = require('./MessageRouter')
const ConversationRouter = require('./ConversationRouter')
const AdminRouter = require('./AdminRouter')
const AdminChatRouter = require('./AdminChatRouter')

const routes = (app) => {
    app.use('/api/user', UserRouter)
    app.use('/api/product', ProductRouter)
    app.use('/api/address', AddressRouter)
    app.use('/api/location', LocationRouter)
    app.use('/api/messages', MessageRouter)
    app.use('/api/conversations', ConversationRouter)
    app.use('/api/admin', AdminRouter)
    app.use('/api/admin/chat', AdminChatRouter)
}


module.exports = routes