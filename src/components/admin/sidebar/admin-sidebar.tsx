import "./admin-sidebar.scss"

export default function AdminSidebar(props){
  const { sidebarMenu } = props;
  //console.log('sidebarMenu:',sidebarMenu);
  return (   
    <aside className="sidebar">
      <nav>
        {sidebarMenu.map((group, index) => (
          <div className="group" key={index}>
            <h3 className="title">{group.title.toUpperCase()}</h3>
            <ul className="menu">
              {group.listItems.map((li, innerIndex) => (
                <li key={`${index}_${innerIndex}`}><a className="menu-item" href={li.url}>
                  <img src={`/${li.icon}`} alt={li.title} />
                  <span>{li.title}</span>
                </a></li>
              ))}
            </ul>
          </div>
        ))}
      </nav>   
    </aside>
  )
}
