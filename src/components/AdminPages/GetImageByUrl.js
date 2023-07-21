import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashCan, faAdd } from '@fortawesome/free-solid-svg-icons'
import axios from '../../api/axios';

export default function GetImageByUrl({urlSrc, itemId, onImageDelete}) {


  function handleDelete() { 
    axios.delete(`/admin/photo/${itemId}`)
    .then(responce =>{
      console.log('Photo deleted', responce);
      onImageDelete(itemId);
    }) .catch(error => {
      console.error('Error deleting photo', error);
    })
    
   }

  return (
        <div className="image-container">
        <img src={urlSrc} className="one-image"/>
        <span className="delete-icon" onClick={handleDelete}><FontAwesomeIcon icon={faTrashCan}/></span>
        <span className="add-icon"><FontAwesomeIcon icon={faAdd}/></span>
        </div>
  )
}
