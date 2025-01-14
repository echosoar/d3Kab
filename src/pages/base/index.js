'use strict';
import { connect } from 'react-redux';
import { Component } from 'react';
import { mapStateToProps } from '../../connect/baseConnect.js';
import { BUTTON } from './button.js';
import Library from '../library/';
import Style from '../style/';
import PropsSetting from '../propsSetting/';
import GlobalDataConfig from '../globalDataConfig/';
import ModuleVersionUpdate from './moduleVersionUpdate.js';
import { message } from 'antd';

require('./base.less');

class Base extends Component {
	constructor(props) {
		super(props);
		/*
		获取全局配置信息
		*/

		if(window.ipcRenderer) {
			window.ipcRenderer.send('getSystemConfig');
			window.ipcRenderer.on('resultGetSystemConfig', (event, args)=>{
				if(this.props.windowDefaultConfigChange) {
					message.success('DataV系统配置修改成功');
				}
				this.props.dispatch({type: 'UPDATE_SYSTEM_CONFIG', data: JSON.parse(args)});
			})
		}
	}

	headerButton( actionObj ) {
		let headerButtonInnerFun = (data = {})=>{
			this.props.dispatch( {type: actionObj.action, data} );
			/*关闭所有侧边栏*/
			this.props.dispatch({type: "LAYOUT_STYLE_CLOSE"});
			this.props.dispatch({ type: 'LIBRARY_CLOSE'});
			this.props.dispatch({type: 'MODULE_PROPS_CLOSE'});
		}

		if(actionObj.onClick) {
			actionObj.onClick(this, headerButtonInnerFun);
		}else{
			headerButtonInnerFun();
		}
	}

	render(){

		let button = BUTTON[this.props.route.path] || [];
		let DataVContainerClass = 'DataV';
		if(this.props.nowHeaderPosi =='bottom') {
			DataVContainerClass += ' DataV-bottom'
		}

		return <div className={DataVContainerClass}>
			<div className="header">
				<i className="logo"></i>
				<div className="header-title">
					Page<br />Configurator
				</div>
				<div className="header-button-container">
				{
					button.map( buttonItem => {
						if( buttonItem.rule ) {
							if( !buttonItem.rule(this) ) return '';
						}
						return <i
							className="header-button"
							onClick={()=>{ this.headerButton.call(this, buttonItem); }}
							data-title={ buttonItem.title }
						>
							{ buttonItem.icon && <span className="header-button-icon" style={{'background': 'url(' + buttonItem.icon + ') center center / contain no-repeat'}}></span>}
							{ buttonItem.name }
						</i>
					} )
				}
				</div>
			</div>
			<Library />
			<Style />
			<PropsSetting />
			<ModuleVersionUpdate />
			{ this.props.isDisplayGlobalDataConfigPage && <GlobalDataConfig /> }
			<div className="main">
			{ this.props.children }
			</div>

		</div>
	}
}


module.exports = connect(mapStateToProps)(Base);
