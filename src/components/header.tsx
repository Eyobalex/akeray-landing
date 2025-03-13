
const Header = ({ title }: { title: string }) => {
    return (
      <header className=" w-full z-50 bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg border-b border-gray-700 ">
        <div className="max-w-7xl mx-auto py-4 sm:px-6 lg:px-8 flex justify-between">
          <h1 className="text-2xl font-semibold text-gray-100">{title}</h1>
  
          <div className="flex justify-center items-center gap-4 w-auto">
            {/* <LocaleSwitcher /> */}
            {/* <Bell size={24}/>
                  <MessageSquare size={24} /> 
                  <ToggleRightIcon size={24} />  */}
          </div>
        </div>
      </header>
    )
  }
  
  export default Header