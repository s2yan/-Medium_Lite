import multer from 'multer';

const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, './public/temp')
    },
    filename: (req, file, cb) => {
        const unqiueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + '-' + unqiueSuffix);
    }
})

const upload = multer({storage: storage})
export { upload }; 