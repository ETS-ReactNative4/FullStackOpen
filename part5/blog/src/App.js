import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'

import './App.css'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs))
  }, [])

  useEffect(() => {
    setTimeout(() => {
      setMessage(null)
    }, 8000)
  }, [message])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (username, password) => {
    try {
      const user = await loginService.login({
        username,
        password,
      })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setMessage({
        text: `Welcome ${user.name}`,
        type: 'success',
      })
    } catch (error) {
      setMessage({
        text: `wrong username or password`,
        type: 'error',
      })
    }
  }

  const handleBlogForm = async (title, author, url) => {
    try {
      const blog = await blogService.create({
        title,
        author,
        url,
      })
      setMessage({
        text: `a new blog ${title} by ${author} added`,
        type: 'success',
      })
      setBlogs(blogs.concat(blog))
    } catch (error) {
      setMessage({
        text: `a new blog ${title} by ${author} NOT added`,
        type: 'error',
      })
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={message} />
      {user === null ? (
        <LoginForm handleLogin={handleLogin} />
      ) : (
        <>
          <p>
            {user.name} logged in <button onClick={handleLogout}>Logout</button>
          </p>
          <BlogForm handleBlogForm={handleBlogForm} />
          {blogs.map((blog) => (
            <Blog key={blog.id} blog={blog} />
          ))}
        </>
      )}
    </div>
  )
}

export default App
