const { Schema, model } = require('mongoose')

const likeSchema = new Schema({
    like: {
        type: Boolean,
        default: false,
    },
    usuarioLike: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
},{
    timestamps: true
})

module.exports = model('Like', likeSchema)