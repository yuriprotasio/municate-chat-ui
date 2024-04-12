export default function Kanban () {
  function roll () {
    console.log('ROLL')
  }

  function modal () {
    console.log('MODAL')
  }

  function allowDrop (e: any) {
    console.log('ALLOW DROP')
  }

  function drop (e: any) {
    console.log('DROP')
  }

  function drag (e: any) {
    console.log('DRAG')
  }
  function purple () {
    console.log('COLOR')
  }
  function grey () {
    console.log('COLOR')
  }
  function green () {
    console.log('COLOR')
  }
  function blue () {
    console.log('COLOR')
  }

  function modalClose () {
    console.log('MODAL CLOSE')
  }

  return (
    <div className="flex flex-col">
      <h2 className="text-left text-xl font-bold ml-[15px] mt-[20px]">Kanban</h2>
      <div className="flex border-b-[2px] border-gray-300 pb-4 py-4 z-10 bg-gray-50">
        <span className="ml-[15px] bg-gray-300 rounded-lg py-[5px] px-[10px] cursor-pointer font-semibold hover:bg-gray-200">Negociações</span>
        <span className="ml-[15px] bg-gray-300 rounded-lg py-[5px] px-[10px] cursor-pointer font-semibold hover:bg-gray-200">Tickets</span>
      </div>
      <body id="bod">
        <div className="body-header">
            <div className="darksoul-toggle-container" id="container">
                <div className="darksoul-toggle-border" id="border">
                    <div className="darksoul-toggle" id="toggle" onClick={roll}>

                    </div>
                </div>
            </div>
        </div>
        
        <div className="darksoul-kanban-board">
            <div className="col" id="todo-col">
                <div className="heading">
                    <h4  id="heading">To Do</h4>
                    <img id="plus" width="32" height="32" src="https://img.icons8.com/sf-black-filled/64/FFFFFF/plus.png" alt="plus" onClick={modal}/>
                </div>
                <div className="wrapper" id="div1" onDrop={drop} onDragOver={allowDrop}>
                    
                    <div className="darksoul-gradient-card-purple" id="1" draggable="true" onDragStart={drag}>
                        <div className="card">
                            <div className="header">
                                <h5 className="purple">DarkSoul-Git</h5>
                            </div>
                            <div className="content">
                                <h3>Index Page Layout Change</h3>
                                <p>Add the layout from the Blog homepage. Add the layout from the Blog home page.</p>
                            </div>
                            <div className="footer">
                                <div className="date">
                                    <img width="25" height="25" src="https://img.icons8.com/sf-black-filled/64/BFBFFC/calendar-plus.png" alt="calendar-plus"/>
                                    <p>03 Mar 2024</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="darksoul-gradient-card-grey" id="2" draggable="true" onDragStart={drag}>
                        <div className="card">
                            <div className="header">
                                <h5 className="grey">DarkSoul-CodePen</h5>
                            </div>
                            <div className="content">
                                <h3>Update About Page</h3>
                                <p>Add Dribble, CodePen & Instagram profiles in the About Page.</p>
                            </div>
                            <div className="footer">
                                <div className="date">
                                    <img width="25" height="25" src="https://img.icons8.com/sf-black-filled/64/DFDFDF/calendar-plus.png" alt="calendar-plus" />
                                    <p>03 Mar 2024</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                </div>
            </div>
            <div className="col">
                <div className="heading">
                    <h4  id="heading">In Progress</h4>
                </div>
                <div className="wrapper" id="div2" onDrop={drop} onDragOver={allowDrop}>
                    <div className="darksoul-gradient-card-blue" id="3" draggable="true" onDragStart={drag}>
                        <div className="card">
                            <div className="header">
                                <h5 className="blue">DarkSoul-Git</h5>
                            </div>
                            <div className="content">
                                <h3>Add FAQ Schema.org</h3>
                                <p>Include the FAQ to the Site.</p>
                            </div>
                            <div className="footer">
                                <div className="date">
                                    <img width="25" height="25" src="https://img.icons8.com/sf-black-filled/64/BFD3FC/calendar-plus.png" alt="calendar-plus"/>
                                    <p>03 Mar 2024</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>    
            <div className="col">
                <div className="heading">
                    <h4 id="heading">Done</h4>
                </div>
                <div className="wrapper" id="div3" onDrop={drop} onDragOver={allowDrop}>
                    <div className="darksoul-gradient-card-green" id="4" draggable="true" onDragStart={drag}>
                        <div className="card">
                            <div className="header">
                                <h5 className="green">DarkSoul-CodePen</h5>
                            </div>
                            <div className="content">
                                <h3>Provide Search Functionality</h3>
                                <p>Include the search functionality in the Navbar for better User Experience.</p>
                            </div>
                            <div className="footer">
                                <div className="date">
                                    <img width="25" height="25" src="https://img.icons8.com/sf-black-filled/64/CFF2A5/calendar-plus.png" alt="calendar-plus"/>
                                    <p>03 Mar 2024</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div id="darksoul-modal">
            <div className="darksoul-modal-content">
              
                <div className="darksoul-modal-content-header">
                    <div className="header" style={{marginLeft: '-4px'}}>
                            <h5 className="purple" id="preview" style={{marginTop: '0px'}}>Insert - Task</h5>
                            <div className="color-picker purple" onClick={purple}></div>
                            <div className="color-picker grey" onClick={grey}></div>
                            <div className="color-picker green" onClick={green}></div>
                            <div className="color-picker blue" onClick={blue}></div>
                    </div>
                    
                    <button type="button" onClick={modalClose} className="modal-close-btn"></button>
                </div>
                <form className="darksoul-form">
                  <div className="darksoul-modal-content-main">
                          <label>Platform</label>
                          <input id="platform" type="text" name="platform" value="" required/>
                          <label>Task</label>
                          <input id="task" type="text" name="task" required/>
                          <label>Description</label>
                          <textarea id="description" name="description"></textarea>
                    
                  </div>
                  <div className="darksoul-modal-content-footer">
                        <div className="darksoul-glowing-button2">
                            <button className="darksoul-button2" type="submit">
                                Submit
                            </button>
                        </div>
                </div>
              </form>
            </div>
        </div>
        <div className="body-footer">
            <h4 className="disclaimer">Designed & Created by <a href="https://darksoul-codepen.github.io/" target="_blank"  id="disclaimer">DarkSoul</a></h4>
        </div>
          
      </body>
    </div>
  )
}