
import React, { useReducer , useState, useRef} from 'react';
import '../../css/taskList.css';

//constantes para las acciones
const CREATE_TASK = "CREATE_TASK";
const DELETE_TASK = "DELETE_TASK";
const FILTER_TASK = "FILTER_TASK";
const CHANGE_STATUS = "CHANGE_STATUS";

const myContext = React.createContext(null);


// const Task = ()=>{
//     //creando el contexto
//     const state = useContext(myContext)
    
//     return (
//             <li></li>
//         )
// }

const TaskList = () => {
    const nombreTareaRef = useRef();
    const completedRef = useRef();


    const [generalID, setGeneralID] = useState(1);
    const [error, setError] = useState("");


    const reducer = (state, action) => {

        switch (action.type) {
            case CREATE_TASK:
                const newTask= {
                    nameTask: action.payload.nameTask,
                    id:action.payload.id,
                    completed:action.payload.completed
                };
                setGeneralID(generalID+1);
                return [
                    ...state,newTask
                ]
                    
            case DELETE_TASK:
                let newState = [...state].filter(element => element.id!== action.payload.idTask); 
                return newState;

            case CHANGE_STATUS:
                let otherState = [...state].map(el=>{
                        if(el.id===action.payload.idTask){
                            el.completed = !el.completed;
                        }
                        return el;
                    }); 
                return otherState;

            case FILTER_TASK:
                return [...action.payload.estado].filter(el=>el.completed===true);

            default:
                return state;
        }

    }

    const submit = (e) =>{
        e.preventDefault();
        setError("");
        if(nombreTareaRef.current.value.length === 0){
            //estableciendo error al no introducir una tarea
            setError("Debe ingresar un nombre para la tarea");
        }else{
            //despachando al reducer
            dispatch(
                {type:CREATE_TASK,
                payload:{
                    nameTask:nombreTareaRef.current.value,
                    id:generalID,
                    completed:completedRef.current.value === "no-completada" ? false:true
                }
                })
                nombreTareaRef.current.value="";
                completedRef.current.value="no-completada";
        }
    }

    const initialState = [{
        nameTask: null,
        id:0,
        completed:false,
    }];


    const [state, dispatch] = useReducer(reducer, initialState)

    return (
        <myContext.Provider value={state}>
            <ul className="uList">
                {
                    state.length<1 ? <li>no hay tareas</li>
                : <>
                   {state.map((el,i)=>{
                        if(el.nameTask === null){
                            return null;
                        }else{
                            return (
                            <li key={i} >{el.nameTask}
                            <span className='completed'>{el.completed ? 
                                <button onClick={()=>dispatch({
                                    type:CHANGE_STATUS,
                                    payload:{
                                        idTask:el.id
                                    }
                                })} className="yes-completed">Completada</button>:

                                <button onClick={()=>dispatch({
                                    type:CHANGE_STATUS,
                                    payload:{
                                        idTask:el.id
                                    }
                                })} className="no-completed">No completada</button>}
                            </span>
                            {/* <span className='completed'>{el.completed ? 
                                <button className='yes-completed'>Completada</button>:
                                <button className='no-completed'>No completada</button>}
                            </span> */}
                            <button  className="btn-eliminar" onClick={()=>dispatch({
                                type:DELETE_TASK,
                                payload:{
                                    idTask:el.id
                                }
                            })}>
                            Eliminar
                            </button>
                            </li>)
                            
                        }
                   })}
                </>
                }

            </ul> 
            <h3>Ingrese Tarea:</h3>
            {error.length>0 && <p className='error'>{error}</p>}

            <form className="form" onSubmit={submit}>
                <input type="text" ref={nombreTareaRef}></input>
                <label htmlFor="completed"></label>
                    <select name="completed" id="completed" ref={completedRef}>
                        <option value="no-completada">No completada</option>
                        <option value="completada">Completada</option>
                    </select>
                <button type='submit'>Enviar</button>
            </form>

             <h4>Filtrar</h4>
            <button onClick={()=>dispatch({type:FILTER_TASK,payload:{estado:[...state]}})}>Filtrar por tareas completadas</button> 
        

            {/* <button onClick={()=>dispatch(
                {type:CREATE_TASK,
                payload:{
                    nameTask:"hacer comida",
                    id:generalID,
                    completed:true
                }
                })}>
                Crear Tarea
            </button> */}

        </myContext.Provider>
        );
        
}

export default TaskList;
