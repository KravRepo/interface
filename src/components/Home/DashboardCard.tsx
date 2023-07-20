type DashboardCardProps = {
  title: string
  content: string
}

export const DashboardCard = ({ title, content }: DashboardCardProps) => {
  return (
    <div className="data-card">
      <span className="tabs">{title}</span>
      <p>{content}</p>
    </div>
  )
}
