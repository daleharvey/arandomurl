<form id="newPost">
  <div class="header">
    <input type="button" value="Preview Post" id="previewPost" />
    <input type="button" value="Delete Post" id="deletePost" />
    <input type="submit" value="Submit Post" id="submitPost" />
  </div>
  <input type="text" placeholder="Post Title" id="postTitle" />
  <div class="row urlPreview">
    <span>/post/</span>
    <input type="text" placeholder="url" id="postUrl" />
  </div>
  <textarea autoresize="true" placeholder="Post Content" id="postInput"></textarea>
  <div id="postPreview" hidden></div>
</form>
