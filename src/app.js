import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { graphql, gql } from 'react-apollo'

export default () => (
  <div>
    <ShopListWithData />
    <NewShopWithMutation />
  </div>
)

const shops = gql`
  query shops {
    shops {
      id
      name
    }
  }
`

const ShopList = ({ data }) => {
  if (data.loading) return <span>Loading...</span>

  if (data.error) return <span>{data.error.message}</span>

  return (
    <ul>
      {data.shops.map(shop => <li key={shop.id}>{shop.name}</li>)}
    </ul>
  )
}

const ShopListWithData = graphql(shops)(ShopList)

class NewShop extends Component {
  constructor(props) {
    super(props)

    this.state = {
      name: '',
    }
  }

  handleSubmit = (event) => {
    event.preventDefault()
    this.props.submit(this.state.name)
    this.setState({ name: '' })
  }

  handleChange = (event) => {
    this.setState({ name: event.target.value })
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label htmlFor="">New shop</label>
        <input placeholder="Name" onChange={this.handleChange} value={this.state.name} />
        <button type="submit">Add</button>
      </form>
    )
  }
}

const createShop = gql`
  mutation create_shop($input: CreateShopInput!) {
    create_shop(input: $input) {
      shop {
        name
      }
    }
  }
`

const NewShopWithMutation = graphql(createShop, {
  props: ({ mutate }) => ({
    submit: (name) => mutate({
      refetchQueries: [{ query: shops }],
      variables: { input: { name } }
    }),
  }),
})(NewShop)
