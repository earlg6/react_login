import { Link } from "react-router-dom"
import GetImageByUrl from "./GetImageByUrl"
import { useState, useEffect } from "react"
import axios from "../../api/axios";

const PHOTO_URL = '/admin/photo';

const Profile = () => {

    const [image, setImage] = useState('');
    const [inputKey, setInputKey] = useState(Date.now());

    function handleImage(e){
        setImage(e.target.files[0]);
        console.log(image);
    }

    const handleUpload = async (e) => {
    e.preventDefault();
    
    try{

        const formData = new FormData();
        formData.append('file', image)
        const response = await axios.post(PHOTO_URL, formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            }
        );
        setImage('');
        setInputKey(Date.now());
        getPhotos();
    } catch(err) {
        if (!err?.response){
            console.log('No Server Response');
        } else {
            console.log(err.response.data.message)
        }
    }
    }


    const [photosArray, setPhotosArray] = useState([]);
    const access_token = localStorage.getItem('access_token');
    const headers = {
        'Accept': 'application/json',
        'Authorization': `Bearer ${access_token}`
    }
    const getPhotos = async () => {
        const { data } = await axios.get(PHOTO_URL, {
            headers: {...headers}
        });
        setPhotosArray(data.data);
      };


    const handleImageDelete = (deleteItemId) => {
        setPhotosArray(prevPhotosArray => prevPhotosArray.filter(item => item.id !== deleteItemId))
    }

    useEffect(() => {
        getPhotos()
    }, [])
    

    return (
        <div className="main">
            <div className="admin-header">
                <h2>Media Manager</h2>
                <div>
                <label htmlFor="upload-file">Upload a file: </label>
                <input type="file" name="file" onChange={handleImage} key={inputKey}/>
                </div>
                <a className="link-button" onClick={handleUpload}>Upload</a>
                <Link to="/admin" className="link-button">Cancel</Link>         
            </div>
            <div className="admin-content">
                {photosArray.map((item) => (
                <GetImageByUrl  urlSrc={item.file_url} 
                                key={item.id} 
                                itemId={item.id}
                                onImageDelete={handleImageDelete} />
                ))
                }
            </div>
            
        </div>
    )
}

export default Profile