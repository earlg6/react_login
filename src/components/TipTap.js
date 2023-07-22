import { Color } from '@tiptap/extension-color'
import ListItem from '@tiptap/extension-list-item'
import TextStyle from '@tiptap/extension-text-style'
import Image from '@tiptap/extension-image'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import React, { useCallback, useState, useEffect } from 'react'
import Modal from './Modal/Modal'
import {FaBold, FaItalic, FaStrikethrough, FaListOl, FaListUl, FaQuoteLeft,
FaRedo, FaUndo, FaUnderline, FaAlignLeft, FaAlignRight, FaAlignCenter, FaImage } from 'react-icons/fa';
import axios from '../api/axios';
import GetImageByUrl from './AdminPages/GetImageByUrl'

const PHOTO_URL = '/admin/photo';

const MenuBar = ({ editor, setModalActive }) => {

  if (!editor) {
    return null
  }

  return (
    <div className='menu-bar'>
      <div>
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={
          !editor.can()
            .chain()
            .focus()
            .toggleBold()
            .run()
        }
        className={editor.isActive('bold') ? 'is-active' : ''}
      >
        <FaBold/>
      </button>

      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={
          !editor.can()
            .chain()
            .focus()
            .toggleItalic()
            .run()
        }
        className={editor.isActive('italic') ? 'is-active' : ''}
      >
        <FaItalic/>
      </button>

      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        disabled={
          !editor.can()
            .chain()
            .focus()
            .toggleUnderline()
            .run()
        }
        className={editor.isActive('underline') ? 'is-active' : ''}
      >
        <FaUnderline/>
      </button>

      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={
          !editor.can()
            .chain()
            .focus()
            .toggleStrike()
            .run()
        }
        className={editor.isActive('strike') ? 'is-active' : ''}
      >
        <FaStrikethrough/>
      </button>

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}
      >
        <b>h1</b>
      </button>

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
      >
        <b>h2</b>
      </button>

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}
      >
        <b>h3</b>
      </button>

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
        className={editor.isActive('heading', { level: 4 }) ? 'is-active' : ''}
      >
        <b>h4</b>
      </button>

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
        className={editor.isActive('heading', { level: 5 }) ? 'is-active' : ''}
      >
        <b>h5</b>
      </button>

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
        className={editor.isActive('heading', { level: 6 }) ? 'is-active' : ''}
      >
        <b>h6</b>
      </button>

      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive('bulletList') ? 'is-active' : ''}
      >
        <FaListUl/>
      </button>

      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive('orderedList') ? 'is-active' : ''}
      >
        <FaListOl/>
      </button>

      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={editor.isActive('blockquote') ? 'is-active' : ''}
      >
        <FaQuoteLeft/>
      </button>
      
      <button
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        className={editor.isActive({ textAlign: 'left' }) ? 'is-active' : ''}
      >
        <FaAlignLeft/>
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        className={editor.isActive({ textAlign: 'center' }) ? 'is-active' : ''}
      >
        <FaAlignCenter/>
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        className={editor.isActive({ textAlign: 'right' }) ? 'is-active' : ''}
      >
        <FaAlignRight/>
      </button>
      </div>

      <div>
        <button onClick={() => { setModalActive(true);}}>
          <FaImage/>
        </button>
      </div>

      <div>


      <button
        onClick={() => editor.chain().focus().undo().run()}
        disabled={
          !editor.can()
            .chain()
            .focus()
            .undo()
            .run()
        }
      >
        <FaUndo/>
      </button>

      <button
        onClick={() => editor.chain().focus().redo().run()}
        disabled={
          !editor.can()
            .chain()
            .focus()
            .redo()
            .run()
        }
      >
        <FaRedo/>
      </button>

      </div>

    </div>
    
    

  )
}


const TipTap = () => {
  const editor = useEditor({
    extensions: [
      Color.configure({ types: [TextStyle.name, ListItem.name] }),
      TextStyle.configure({ types: [ListItem.name] }),
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
        },
      }),
      Underline,
      Image,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      })
    ],
    content: ``,
  })

  
  const [selectedImageUrl, setSelectedImageUrl] = useState('');
  const [modalActive, setModalActive] = useState(false);
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

    useEffect(() => {
        getPhotos()
    }, [])  
    
    const handleImageSelect = (selectedUrl) => {
      setSelectedImageUrl(selectedUrl);
      editor.chain().focus().setImage({ src: selectedUrl }).run();
      setModalActive(false);
    };

  return (
    <div className='text-editor'>
      <MenuBar editor={editor} setModalActive={setModalActive} selectedImageUrl={selectedImageUrl} handleImageSelect={handleImageSelect}/>
      <EditorContent editor={editor} />
      <Modal active={modalActive} setActive={setModalActive}>
                {photosArray.map((item) => (
                <GetImageByUrl  urlSrc={item.file_url} 
                                key={item.id} 
                                itemId={item.id}
                                onImageSelect={handleImageSelect}
                />
                ))
                }
      </Modal>
    </div>
  )
}

export default TipTap