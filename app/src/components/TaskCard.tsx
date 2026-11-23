type Props = { title: string; tags: string[] }

// A list item holding a level-3 heading, so the suite finds a card by what it contains.
export default function TaskCard({ title, tags }: Props) {
  return (
    <li className="card glass">
      <h3>{title}</h3>
      <ul className="tags">
        {tags.map(tag => (
          <li key={tag} className="tag">
            {tag}
          </li>
        ))}
      </ul>
    </li>
  )
}
