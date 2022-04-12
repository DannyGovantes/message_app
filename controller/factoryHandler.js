const catchAsync = require('./../utils/catchAsync')
exports.create = Model => catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);
    res.status(201).json({
        status: 'Success',
        data: {
            doc
        }
    });
})
exports.delete = Model => catchAsync(async (req, res, next) => {
    await Model.delete(req.params.id);
    res.status(204).json({
        status: 'Success',
        data: null
    })

})