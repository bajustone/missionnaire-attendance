import style from './style';
import { Component } from 'preact';

export default class FormInput extends Component {
    state = {
        type: "text"
    }
    render (props, {type}) {
        const { leadingIcon, prefixIcon, ...transferedProps} = props;
        if(props.type) type = props.type;
        return <div className={style.formElement} >
            {props.leadingIcon ? <button className={style.leadingIcon} type="button">
                <img src={props.leadingIcon}/>
            </button> : null}
            
            <input className={props.leadingIcon ? style.withLeadingSpace : ""} {...transferedProps} placeholder={props.label}  type={type} />
            <label for={props.name}>{props.label}</label>
            {props.prefixIcon ? <button onClick={evt=>{props.onPrefixButtonClick ? props.onPrefixButtonClick(this) : null}} className={style.prefixIcon} type="button">
                <img src={props.prefixIcon}/>
            </button> : null}
        </div>
}
}