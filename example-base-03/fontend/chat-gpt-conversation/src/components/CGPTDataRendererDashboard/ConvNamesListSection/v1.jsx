import React, { useState, useEffect, useRef } from "react";

const Sidebar = ({
  jsonData = [],
  onItemSelect = () => { },
  selectedConv: selItem = null,
  onItemSelectionChange = () => { },
  onHideClick = () => { },
  customSideBarStyle={}
}) => {
  const [conversationNames, setConversationNames] = useState([]);
  const [selectedConv, setSelectedConv] = useState(null);
  const myRef = useRef(null);

  useEffect(() => {
    // Extract conversation names from jsonData and set them in state
    const names = jsonData.map((conversation) => ({
      title: conversation.title,
      id: conversation.id,
    }));
    setConversationNames(names);
  }, [jsonData]);

  useEffect(() => {
    //console.log(`Selected item : ${JSON.stringify(selItem)}`);
    setSelectedConv(selItem);
    
  }, [selItem])

  useEffect(()=>{
    if(selectedConv && selectedConv.id!=null){
      // myRef.current?.scrollIntoView({
      //   behavior: "smooth",
      //   block: "nearest",
      //   inline: "start",
      // });
      window.scrollTo({
        top: myRef.current.offsetTop,
        behavior: "smooth"
      })
    }

  },[selectedConv])

  const handleLinkSelection = (selectedItem) => {
    console.log(JSON.stringify(selectedItem));
    // setSelectedLink(selectedItem);
    // navigate(`${selectedItem.topicId}`);
    setSelectedConv(selectedItem);
    onItemSelect(selectedItem);
  };

  return (
    <div
      className="w-[200px] bg-gray-100 dark:bg-gray-900 p-5"
      style={customSideBarStyle}
    >
      <button 
        onClick={onHideClick}
        className="mb-4 px-3 py-1 bg-red-500 dark:bg-red-900 text-white dark:text-black text-sm rounded hover:bg-red-600 transition-colors"
      >
        Hide
      </button>
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Conversation Names</h2>
      <ul className="space-y-2">
        {conversationNames.map((conv) => (
          <li key={conv.id}>
            <span
              ref={selectedConv && selectedConv.id!=null ? myRef : null}
              className={`cursor-pointer block p-2 rounded transition-colors ${
                selectedConv && selectedConv.id === conv.id
                  ? "font-bold text-lg text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
              onClick={() => handleLinkSelection(conv)}
            >
              {conv.title}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};



export default Sidebar;
