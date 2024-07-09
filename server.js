import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose';
import cors from 'cors'
import bodyParser from 'body-parser';
mongoose.connect(`${process.env.MONGO_URI}`).then(() => console.log("db connected")).catch((err) => console.log("some error occured: ", err))

const dataSchema = new mongoose.Schema({
    websiteUrl: String,
    username: String,
    password: String,
    userAuthId: String,
    uniqueId: String
})

const Data = mongoose.model('passwords', dataSchema);

const app = express();

app.use(bodyParser.json());

app.use(cors())

app.delete('/deletePassword', async (req, res) => {
    await Data.deleteOne(req.body);
    res.json({ msg: "password details deleted successfully" })
})

app.put('/editPasswordDetails', async (req, res) => {
    const query = await Data.findOneAndUpdate({ uniqueId: req.body.uniqueId }, req.body, { new: true });
    console.log("update successful: ", query);
    res.json({ msg: "password details updated successfully" });
})

app.post('/getAllPasswords', async (req, res) => {
    const passwords = await Data.find({ userAuthId: req.body.userAuthId });
    console.log(req.body)
    console.log("These are all passwords: ", passwords)
    res.send(passwords);
})

app.post('/', async (req, res) => {
    const pass = new Data(req.body);
    const result = await pass.save();
    console.log(result)
    return res.send(req.body)
})

app.listen(3000, () => {
    console.log("Sever is listening on port 3000")
})