// import React, {Component} from 'react';
// import PropTypes from 'prop-types';
// import './TextSelect.css'

// export default class LineChartContainer extends Component { 
//   constructor(props) {
//     super(props);    
//     this.state = {
//     }
//     this.getInitialState = this.getInitialState.bind(this);
//     this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this);
//     this.handleChange = this.handleChange.bind(this);
//   }

//   propTypes = {
//     options: PropTypes.any.isRequired,
//     active: PropTypes.any.isRequired,
//     onChange: PropTypes.func.isRequired,
//     className: PropTypes.string
//   }

//   getInitialState() {
//     return {
//       selectedOption: this.props.active
//     }
//   }

//   componentWillReceiveProps(nextProps) {
//     (this.props.active !== nextProps.active) && this.setState({ selectedOption: nextProps.active });
//   }

//   handleChange (event) {
//     this.setState({
//       selectedOption: event.target.value
//     });
    
//     this.props.onChange(event, event.target.value, this.props.options[event.target.value])
//   }
  
//   render() {
//     let {options, active, className} = this.props

//     let classes = 'react-textselect'
//     if (className) classes += ' ' + className

//     return (
//       <span className={classes}>
//       {options[active]}

//       <select className='react-textselect-input' onChange={this.handleChange} value={this.state.selectedOption}>
//         {/* {lodashMap(options, function mapOptions (value, key) {
//           return (
//             <option value={key} key={key}>{value}</option>
//           )
//         })} */}

//         {options.map(function (value, key) {
//           return (
//             <option value={key} key={key}>{value}</option>
//           )
//         })}
//         </select>
//       </span>
//     )
//   }
// }

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import lodash from 'lodash';
import './TextSelect.css'

export default class TextSelect extends Component { 
  constructor(props) {
    super(props);    
    this.state = {

    }
    this.getInitialState = this.getInitialState.bind(this);
    this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  getInitialState() {
    return {
      selectedOption: this.props.active
    }
  }

  componentWillReceiveProps(nextProps) {
    (this.props.active !== nextProps.active) && this.setState({ selectedOption: nextProps.active });
  }

  handleChange (event) {
    this.setState({
      selectedOption: event.target.value
    });
    
    this.props.onChange(event, event.target.value, this.props.options[event.target.value])
  }

  render() {
    var {options, active, className} = this.props

    var classes = 'react-textselect'
    if (className) classes += ' ' + className

    return (
      <span className={classes}>
      {options[active]}

      <select className='react-textselect-input' onChange={this.handleChange} value={this.state.selectedOption}>
        {lodash.map(options, function mapOptions (value, key) {
          return (
            <option value={key} key={key}>{value}</option>
          )
        })}
        </select>
      </span>
    )
  }
}

TextSelect.propTypes = {
  options: PropTypes.any.isRequired,
  active: PropTypes.any.isRequired,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string
}
