import React from 'react'
import { connect } from 'react-redux';
import { chooseBA, chooseDays } from '../../actions/filterMenu';

// import React, { Component } from 'react';
// import Calendar from 'react-calendar';

class FilterWindow extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedDateRange: 'sortByDateRange',
      selectedBalancingAuthority: 'sortByBalancingAuthority',
      // date: new Date(),
    }
  }

  // Drop down
  handleDropDownDateRange = (e) => {
    this.setState({
      selectedDateRange: e.target.value,
    })
    console.log('You have submitted: ', e.target.value, ' day(s).')
  }

  handleDropDownBalancingAuthority = (e) => {
    this.setState({
      selectedBalancingAuthority: e.target.value,
    })
    console.log('You have submitted: ', e.target.value, ' balancing authority.')
  }

  // onChange = date => this.setState({ date })

  // Apply filters
  applyFilters = (e) => {
    e.preventDefault();
    console.log(this.state);
    this.props.chooseBA(this.state.selectedBalancingAuthority);
    this.props.chooseDays(this.state.selectedDateRange);
  }

  render() {
    return (
      /* Navigation Bar */
      <div className='sidebar-navigation'>
        {/* Apply Filters Form */}
        <form onSubmit={(e) => this.applyFilters(e)}>
          
          {/* Sort By Date Range */}
          <div className='drop-down'>
            <select
              class='block'
              value={this.state.selectedDateRange}
              onChange={(e) => this.handleDropDownDateRange(e)}
              id='sortByDateRange'
            >
              <option value='sortByDateRange'>Date Range</option>
              <option value='1'>1 Day</option>
              <option value='2'>2 Days</option>
              <option value='3'>3 Days</option>
              <option value='4'>4 Days</option>
              <option value='5'>5 Days</option>
              <option value='6'>6 Days</option>
              <option value='7'>7 Days</option>
            </select>
          </div>
          <br></br>

          {/* Sort By Balancing Authority */}
          <div className='drop-down-balancing-authority'>
            <select
              class='block'
              value={this.state.selectedBalancingAuthority}
              onChange={(e) => this.handleDropDownBalancingAuthority(e)}
              id='sortByBalancingAuthority'
            >
              <option value='sortByBalancingAuthority'>Balancing Authority</option>
              <option value='YAD'>YAD</option>
              <option value='DEAA'>DEAA</option>
              <option value='AECI'>AECI</option>
              <option value='AVRN'>AVRN</option>
              <option value='AVA'>AVA</option>
              <option value='BANC'>BANC</option>
              <option value='BPAT'>BPAT</option>
              <option value='CISO'>CISO</option>
              <option value='HST'>HST</option>
              <option value='TPWR'>TPWR</option>
              <option value='TAL'>TAL</option>
              <option value='DUK'>DUK</option>
              <option value='FPC'>FPC</option>
              <option value='CPLE'>CPLE</option>
              <option value='CPLW'>CPLW</option>
              <option value='EPE'>EPE</option>
              <option value='EEI'>EEI</option>
              <option value='ERCO'>ERCO</option>
              <option value='FMPP'>FMPP</option>
              <option value='FPL'>FPL</option>
              <option value='GVL'>GVL</option>
              <option value='GLHB'>GLHB</option>
              <option value='GRID'>GRID</option>
              <option value='GRIF'>GRIF</option>
              <option value='ISNE'>ISNE</option>
              <option value='IPCO'>IPCO</option>
              <option value='IID'>IID</option>
              <option value='JEA'>JEA</option>
              <option value='LDWP'>LDWP</option>
              <option value='LGEE'>LGEE</option>
              <option value='MISO'>MISO</option>
              <option value='GWA'>GWA</option>
              <option value='WWA'>WWA</option>
              <option value='NEVP'>NEVP</option>
              <option value='HGMA'>HGMA</option>
              <option value='NYIS'>NYIS</option>
              <option value='NWMT'>NWMT</option>
              <option value='OVEC'>OVEC</option>
              <option value='PJM'>PJM</option>
              <option value='DOPD'>DOPD</option>
              <option value='PACE'>PACE</option>
              <option value='PACW'>PACW</option>
              <option value='PGE'>PGE</option>
              <option value='AEC'>AEC</option>
              <option value='PSCO'>PSCO</option>
              <option value='PNM'>PNM</option>
              <option value='CHPD'>CHPD</option>
              <option value='GCPD'>GCPD</option>
              <option value='PSEI'>PSEI</option>
              <option value='SRP'>SRP</option>
              <option value='SCL'>SCL</option>
              <option value='SEC'>SEC</option>
              <option value='SCEG'>SCEG</option>
              <option value='SC'>SC</option>
              <option value='SEPA'>SEPA</option>
              <option value='SOCO'>SOCO</option>
              <option value='SWPP'>SWPP</option>
              <option value='SPA'>SPA</option>
              <option value='TEC'>TEC</option>
              <option value='TVA'>TVA</option>
              <option value='TEPC'>TEPC</option>
              <option value='TIDC'>TIDC</option>
              <option value='NSB'>NSB</option>
              <option value='WALC'>WALC</option>
              <option value='WACM'>WACM</option>
              <option value='WAUW'>WAUW</option>
            </select>
          </div>
          <br></br>

          {/* <div>
            <Calendar
              onChange={this.onChange}
              value={this.state.date}
            />
          </div> */}

          {/* Apply Filters Button */}
          <button type='submit' class='block'>
            Apply Filters
          </button>
        </form>
      </div>
    )
  }
}

function mapStateToProps(reduxState){
  return {
    filterMenuData: reduxState
  };
}



// export default FilterWindow
export default connect(mapStateToProps, {chooseBA, chooseDays})(FilterWindow)
