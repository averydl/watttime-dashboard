import React from 'react'
import '../App.css'

class FilterWindow extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      // Search bar
      searchInput: '',

      // Gender Checkboxes
      isMale: false,
      isFemale: false,
      isOther: false,

      // Amenities Checkboxes
      isAdaAccessible: false,
      isFeminineHygiene: false,
      isDoorCode: false,
      isContraceptives: false,
      isFamily: false,

      // Star rating
      selectedValue: 'SortByRating',
      isStarRating: null,
    }
  }

  // Search bar
  handleSearchBar = (e) => {
    this.setState({ searchInput: e.target.value })
    console.log(e.target.value)
  }

  onSubmitSearchBar = (e) => {
    e.preventDefault()
    console.log(this.state.searchInput)
  }

  // Gender Checkboxes
  handleGenderCheckboxChange = (e) => {
    const target = e.target
    if (target.name === 'male') {
      console.log(target.checked + ' male')
      this.setState({ isMale: true })
    }
    if (target.name === 'female') {
      console.log(target.checked + ' female')
      this.setState({ isFemale: true })
    }
    if (target.name === 'other') {
      console.log(target.checked + ' other')
      this.setState({ isOther: true })
    }
  }

  // Amenities Checkboxes
  handleAmenitiesCheckboxes = (e) => {
    const target = e.target
    if (target.name === 'adaAccessible') {
      console.log(target.checked + ' adaAccessible')
      this.setState({ isAdaAccessible: true })
    }
    if (target.name === 'feminineHygiene') {
      console.log(target.checked + ' feminineHygiene')
      this.setState({ isFeminineHygiene: true })
    }
    if (target.name === 'doorCode') {
      console.log(target.checked + ' doorCode')
      this.setState({ isDoorCode: true })
    }
    if (target.name === 'contraceptives') {
      console.log(target.checked + ' contraceptives')
      this.setState({ isContraceptives: true })
    }
    if (target.name === 'family') {
      console.log(target.checked + ' family')
      this.setState({ isFamily: true })
    }
  }

  // Drop down
  handleDropDownValue = (e) => {
    this.setState({
      selectedValue: e.target.value,
    })
    console.log('You have submitted:', e.target.value)
  }

  // Apply filters
  applyFilters = (e) => {
    e.preventDefault()
    console.log(this.state)
  }

  render() {
    return (
      /* Navigation Bar */
      <div className='sidebar-navigation'>
        {/* Search Bar */}
        <div className='search-bar'>
          <form onSubmit={(e) => this.onSubmitSearchBar(e)}>
            <input
              type='search-bar'
              className='input'
              id='addInput'
              placeholder='Location'
              onChange={(e) => this.handleSearchBar(e)}
            />
            <br></br><br></br>
            <button submit='submit' class='block'>Search</button>
          </form>
        </div>
        <br></br>

        {/* Apply Filters Form */}
        <form onSubmit={(e) => this.applyFilters(e)}>
          {/* Gender Checkboxes */}
          <div className='gender-checkboxes'>
            <input
              name='male'
              id='male'
              type='checkbox'
              checked={this.state.male}
              onChange={(e) => this.handleGenderCheckboxChange(e)}
            />
            <label htmlFor='male'>Male</label>
            <br></br>
            <input
              name='female'
              id='female'
              type='checkbox'
              checked={this.state.male}
              onChange={(e) => this.handleGenderCheckboxChange(e)}
            />
            <label htmlFor='female'>Female</label>
            <br></br>

            <input
              name='other'
              id='other'
              type='checkbox'
              checked={this.state.male}
              onChange={(e) => this.handleGenderCheckboxChange(e)}
            />
            <label htmlFor='other'>Other</label>
          </div>
          <br></br>

          {/* Amenities Checkboxes */}
          <div className='amenities-checkboxes'>
            <input
              name='adaAccessible'
              id='adaAccessible'
              type='checkbox'
              checked={this.state.adaAccessible}
              onChange={(e) => this.handleAmenitiesCheckboxes(e)}
            />
            <label htmlFor='adaAccessible'>Ada Accessible</label>
            <br></br>

            <input
              name='feminineHygiene'
              id='feminineHygiene'
              type='checkbox'
              checked={this.state.feminineHygiene}
              onChange={(e) => this.handleAmenitiesCheckboxes(e)}
            />
            <label htmlFor='feminineHygien'>Feminine Hygiene</label>
            <br></br>

            <input
              name='doorCode'
              id='doorCode'
              type='checkbox'
              checked={this.state.doorCode}
              onChange={(e) => this.handleAmenitiesCheckboxes(e)}
            />
            <label htmlFor='doorCode'>Door Code</label>
            <br></br>

            <input
              name='contraceptives'
              id='contraceptives'
              type='checkbox'
              checked={this.state.contraceptives}
              onChange={(e) => this.handleAmenitiesCheckboxes(e)}
            />
            <label htmlFor='contraceptive'>Contraceptives</label>
            <br></br>

            <input
              name='family'
              id='family'
              type='checkbox'
              checked={this.state.family}
              onChange={(e) => this.handleAmenitiesCheckboxes(e)}
            />
            <label htmlFor='contraceptives'>Family</label>
          </div>
          <br></br>

          {/* Star Ratings Drop Down Menu */}
          <div className='drop-down'>
            <select
              class='block'
              value={this.state.selectedValue}
              onChange={(e) => this.handleDropDownValue(e)}
              id='sortByRating'
            >
              <option value='sortByRating'>Sort by Rating</option>
              <option value='1 Star'>1 Star</option>
              <option value='2 Star'>2 Star</option>
              <option value='3 Star'>3 Star</option>
              <option value='4 Star'>4 Star</option>
              <option value='5 Star'>5 Star</option>
            </select>
          </div>
          <br></br>

          {/* Apply Filters Button */}
          <button type='submit' class='block'>
            Apply Filters
          </button>
        </form>
      </div>
    )
  }
}

export default FilterWindow
