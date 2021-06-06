const multer = require('multer')

exports.imageUploading = (dest, type) => {
    const multerStorage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, `public/images/${dest}`)
        },
        filename: (req, file, cb) => {
            const ext = file.mimetype.split('/')[1]
            cb(null, `${type}-${req.user.user_id}-${Date.now()}.${ext}`)
        }
    })

    const filter = (req, file, cb) => {
        if (file.mimetype.startsWith('image')) {
            cb(null, true)
        } else {
            cb(new Error('Only images'), false)
        }
    }

    const upload = multer({ storage: multerStorage, fileFilter: filter })

    return upload.single('image')
}