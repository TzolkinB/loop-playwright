type Props = { title: string; tags: string[] }

// A div, not an article: the suite's page object finds cards as divs inside a column.
export default function TaskCard({ title, tags }: Props) {
  return (
    <div className="card glass">
      <h3>{title}</h3>
      <ul className="tags">
        {tags.map(tag => (
          <li key={tag} className="tag">
            {tag}
          </li>
        ))}
      </ul>
    </div>
  )
}
