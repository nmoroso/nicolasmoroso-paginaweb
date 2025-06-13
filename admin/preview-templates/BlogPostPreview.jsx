import React from "react";

const BlogPostPreview = ({ entry, widgetFor, getAsset }) => {
  const data = entry.getIn(["data"]);
  const image = getAsset(data.get("image"));
  const categories = data.get("categories") || [];
  const tags = data.get("tags") || [];

  return (
    <div className="blog-post-preview">
      {image ? <img src={image.toString()} alt="" /> : null}
      <h1>{data.get("title")}</h1>
      <p>{data.get("summary")}</p>
      <div>
        <strong>{data.get("author")}</strong> - <span>{data.get("date")}</span>
      </div>
      {categories.size ? (
        <ul>
          {categories.map((cat) => (
            <li key={cat}>{cat}</li>
          ))}
        </ul>
      ) : null}
      {tags.size ? (
        <ul>
          {tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
      ) : null}
      <div>{widgetFor("body")}</div>
    </div>
  );
};

export default BlogPostPreview;
