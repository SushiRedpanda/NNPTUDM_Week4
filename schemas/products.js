let mongoose = require("mongoose");
let Schema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    images: {
        type: Array[String],
        required: true
    },
    creationAt: {
        type: Date,
        required: true
    },
    updatedAt: {
        type: Date,
        required: true
    },
    isDeleted: {
        type: Boolean,
        required: true
    }
});

module.exports = mongoose.model("Products", Schema);