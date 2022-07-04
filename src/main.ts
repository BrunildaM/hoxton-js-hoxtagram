// solution goes here

type CommentData = {
    id: number,
    content: string,
    imageId: number
}

type Image = {
    id: number,
    title: string,
    likes: number,
    image: string
    comments: CommentData[]
}

type State = {
   images: Image[]
}



let state: State = {
    images: []
  }

const imageContainerEl = document.querySelector(".image-container")

function getPosts() {
    return fetch ("http://localhost:5000/images")
        .then ( resp => resp.json())
}


function createComment(imageId, content) {
    return fetch('http://localhost:5000/comments', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            imageId: imageId,
            content: content
        })
    }) .then(resp => resp.json())
}

function renderPost (image) {

    if (imageContainerEl === null) return

    const articleEL = document.createElement('article')
    articleEL.setAttribute("class", "image-card")

    const titleEl = document.createElement('h2')
    titleEl.setAttribute("class", "title")
    titleEl.textContent = image.title

    const imgEl = document.createElement('img')
    imgEl.setAttribute("class", "image")
    imgEl.setAttribute("src", image.image)

    const likesDiv = document.createElement('div')
    likesDiv.setAttribute("class", "likes-section")

    const likeEl = document.createElement('span')
    likeEl.setAttribute("class", "likes")
    likeEl.textContent = `${image.likes} like`

    const buttonEl = document.createElement('button')
    buttonEl.setAttribute("class", "like-button")
    buttonEl.textContent = '♥'

    likesDiv.append(likeEl, buttonEl)

    const commentsList = document.createElement('ul')
    commentsList.setAttribute("class", "comments")

    for (const comment of image.comments) {

    const commentsLiEl = document.createElement('li')
    commentsLiEl.textContent = comment.content
    commentsList.append(commentsLiEl)
    }

    const newCommentForm = document.createElement('form')
    newCommentForm.className = "comment-form"

    const commentInput = document.createElement('input')
    commentInput.className = 'comment-input'
    commentInput.type = 'text'
    commentInput.placeholder = 'Feel free to comment'
    commentInput.name = 'comment'

    newCommentForm.append(commentInput)
    newCommentForm.addEventListener("submit", function (event) {
        event.preventDefault()
        createComment(image.id, newCommentForm.comment.value)
        .then(function (createComment) {
            image.comment.push(createComment)
            render()
        })

    })

    articleEL.append(titleEl, imgEl, likesDiv, commentsList, newCommentForm)
    imageContainerEl.append(articleEL)

}

/* <article class="image-card">
        <h2 class="title">Title of image goes here</h2>
        <img src="./assets/image-placeholder.jpg" class="image" />
        <div class="likes-section">
          <span class="likes">0 likes</span>
          <button class="like-button">♥</button>
        </div>
        <ul class="comments">
          <li>Get rid of these comments</li>
          <li>And replace them with the real ones</li>
          <li>From the server</li>
        </ul>
      </article> */


function renderPosts () {
    //@ts-ignore
    imageContainerEl.innerHTML =  ''

    for (const image of state.images) {
        renderPost(image)
    }
}

function render () {
    renderPosts()
}

    render()
    getPosts().then(images => {
        state.images = images
        render()
    })
