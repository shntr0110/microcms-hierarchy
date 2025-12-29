// MenuItem.tsx
export type MenuType = {
  name: string
  path: string
  children?: MenuType[]
}

const MenuItem = ({ menuItem }: { menuItem: MenuType }) => {
  return (
    <>
      <a href={menuItem.path} className="">
        {menuItem.name}
      </a>
      {menuItem.children && menuItem.children.length > 0 && (
        <ul className="ml-4 space-y-2">
          {menuItem.children.map((childItem) => (
            <li className="text-sm" key={childItem.name}>
              <MenuItem menuItem={childItem} />
            </li>
          ))}
        </ul>
      )}
    </>
  )
}

export default MenuItem
