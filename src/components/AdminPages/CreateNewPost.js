import React from 'react'
import { Link } from 'react-router-dom'
import Tiptap from '../TipTap'

export default function CreateNewPost() {
    return (
        <div className="main">
            <div className="admin-header">
                <h2>Create New Post</h2>
                <Link to="/admin" className="link-button">Cancel</Link>         
            </div>
            <div className="admin-content">
                <Tiptap/>
            </div>
            
        </div>
    )
}
