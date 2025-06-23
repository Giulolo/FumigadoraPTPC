import Link from 'next/link';
import {
  cartCrud,
  appointmentCrud,
  categoryCrud,
  expenseCrud,
  invoiceCrud,
  orderCrud,
  productCrud,
  quoteCrud,
  userCrud,
} from '@/lib/prisma';

export default async function Home() {
  // Todo crud, no api
  const users = await userCrud.getAll();
  const products = await productCrud.getAll();
  const orders = await orderCrud.getAll();
  const appointments = await appointmentCrud.getAll();
  const quotes = await quoteCrud.getAll();
  const invoices = await invoiceCrud.getAll();
  const categories = await categoryCrud.getAll();
  const expenses = await expenseCrud.getAll();
  const carts = await cartCrud.getByUserId(1);

  const expensesByCategory = await expenseCrud.getTotalByCategory();
  const monthlyExpenses = await expenseCrud.getMonthlyTotals();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-gray-900">
          Business Dashboard
        </h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-sm font-medium text-gray-500">Total Users</h3>
            <p className="text-3xl font-bold text-blue-600">{users.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-sm font-medium text-gray-500">
              Total Products
            </h3>
            <p className="text-3xl font-bold text-green-600">
              {products.length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-sm font-medium text-gray-500">Total Orders</h3>
            <p className="text-3xl font-bold text-purple-600">
              {orders.length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-sm font-medium text-gray-500">
              Pending Appointments
            </h3>
            <p className="text-3xl font-bold text-orange-600">
              {appointments.filter(a => a.status === 'SCHEDULED').length}
            </p>
          </div>
        </div>

        {/* Users Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Users</h2>
          <div className="grid gap-4">
            {users.slice(0, 5).map(user => (
              <div
                key={user.id}
                className="bg-white p-4 rounded-lg shadow-sm border"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{user.name}</h3>
                    <p className="text-gray-600">{user.email}</p>
                    <p className="text-sm text-gray-500">{user.phone}</p>
                    <p className="text-sm text-gray-500">{user.address}</p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        user.role === 'ADMIN'
                          ? 'bg-red-100 text-red-800'
                          : user.role === 'EMPLOYEE'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {user.role}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      {user.isActive ? '✅ Active' : '❌ Inactive'}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Products Section */}
        <section className="mb-12">
          <div>
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Products</h2>
            <button style={{ padding: '10px 20px', fontSize: '16px' }}>
              <Link href="/products">Go to Products</Link>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.slice(0, 6).map(product => (
              <div
                key={product.id}
                className="bg-white p-4 rounded-lg shadow-sm border"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg">{product.name}</h3>
                  {product.featured && (
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-medium">
                      Featured
                    </span>
                  )}
                </div>
                <p className="text-gray-600 text-sm mb-2">
                  {product.description}
                </p>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-lg font-bold text-green-600">
                      $
                      {typeof product.price?.toNumber() === 'function'
                        ? product.price.toNumber().toFixed(2)
                        : product.price}
                    </p>
                    <p className="text-sm text-gray-500">
                      Stock: {product.stock}
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        product.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {product.isActive ? 'Active' : 'Inactive'}
                    </span>
                    {product.category && (
                      <p className="text-xs text-gray-500 mt-1">
                        {product.category.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Orders Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">
            Recent Orders
          </h2>
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Order ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {orders.slice(0, 5).map(order => (
                    <tr key={order.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{order.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {order.user?.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {order.user?.email}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            order.status === 'COMPLETED'
                              ? 'bg-green-100 text-green-800'
                              : order.status === 'PENDING'
                              ? 'bg-yellow-100 text-yellow-800'
                              : order.status === 'SHIPPED'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        $
                        {typeof order.total?.toNumber === 'function'
                          ? order.total.toNumber().toFixed(2)
                          : order.total}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Appointments Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">
            Upcoming Appointments
          </h2>
          <div className="grid gap-4">
            {appointments.slice(0, 5).map(appointment => (
              <div
                key={appointment.id}
                className="bg-white p-4 rounded-lg shadow-sm border"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">
                      {appointment.title}
                    </h3>
                    <p className="text-gray-600">{appointment.description}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(appointment.scheduledDate).toLocaleDateString()}
                      {appointment.scheduledTime &&
                        ` at ${appointment.scheduledTime}`}
                    </p>
                    {appointment.user && (
                      <p className="text-sm text-gray-500">
                        Client: {appointment.user.name}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        appointment.status === 'SCHEDULED'
                          ? 'bg-blue-100 text-blue-800'
                          : appointment.status === 'COMPLETED'
                          ? 'bg-green-100 text-green-800'
                          : appointment.status === 'CANCELLED'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {appointment.status}
                    </span>
                    {appointment.appointmentType && (
                      <p className="text-xs text-gray-500 mt-1">
                        {appointment.appointmentType}
                      </p>
                    )}
                    {appointment.assignedUser && (
                      <p className="text-xs text-gray-500">
                        Assigned: {appointment.assignedUser.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Quotes Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">
            Recent Quotes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quotes.slice(0, 4).map(quote => (
              <div
                key={quote.id}
                className="bg-white p-4 rounded-lg shadow-sm border"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg">{quote.title}</h3>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      quote.status === 'APPROVED'
                        ? 'bg-green-100 text-green-800'
                        : quote.status === 'PENDING'
                        ? 'bg-yellow-100 text-yellow-800'
                        : quote.status === 'REJECTED'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {quote.status}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-2">
                  {quote.description}
                </p>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-lg font-bold text-green-600">
                      $
                      {typeof quote.amount?.toNumber === 'function'
                        ? quote.amount.toNumber().toFixed(2)
                        : quote.amount}
                    </p>
                    {quote.user && (
                      <p className="text-sm text-gray-500">
                        Client: {quote.user.name}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">
                      Created: {new Date(quote.createdAt).toLocaleDateString()}
                    </p>
                    {quote.validUntil && (
                      <p className="text-xs text-gray-500">
                        Valid until:{' '}
                        {new Date(quote.validUntil).toLocaleDateString()}
                      </p>
                    )}
                    {quote.creator && (
                      <p className="text-xs text-gray-500">
                        By: {quote.creator.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Invoices Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">
            Recent Invoices
          </h2>
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Invoice #
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Due Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {invoices.slice(0, 5).map(invoice => (
                    <tr key={invoice.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {invoice.invoiceNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {invoice.order?.user?.name || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        $
                        {typeof invoice.amount?.toNumber === 'function'
                          ? invoice.amount.toNumber().toFixed(2)
                          : invoice.amount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            invoice.paidAt
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {invoice.paidAt ? 'Paid' : 'Unpaid'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {invoice.dueDate
                          ? new Date(invoice.dueDate).toLocaleDateString()
                          : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map(category => (
              <div
                key={category.id}
                className="bg-white p-4 rounded-lg shadow-sm border"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{category.name}</h3>
                    <p className="text-gray-600 text-sm">
                      {category.description}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Slug: {category.slug}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      category.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {category.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Expenses Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">
            Recent Expenses
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {expenses.slice(0, 6).map(expense => (
              <div
                key={expense.id}
                className="bg-white p-4 rounded-lg shadow-sm border"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">
                      {expense.description}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Category: {expense.category}
                    </p>
                    <p className="text-xs text-gray-500">
                      Date: {new Date(expense.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-red-600">
                      $
                      {typeof expense.amount?.toNumber === 'function'
                        ? expense.amount.toNumber().toFixed(2)
                        : expense.amount}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Expense Analytics */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">
            Expense Analytics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold mb-4">
                Expenses by Category
              </h3>
              <div className="space-y-2">
                {expensesByCategory.map((item, index: number) => (
                  <div
                    key={index}
                    className="flex justify-between items-center"
                  >
                    <span className="text-sm text-gray-600">
                      {item.category}
                    </span>
                    <div className="text-right">
                      <span className="font-medium">
                        ${item._sum.amount?.toNumber?.() || item._sum.amount}
                      </span>
                      <span className="text-xs text-gray-500 ml-2">
                        ({item._count} items)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold mb-4">Monthly Expenses</h3>
              <div className="space-y-2">
                {Object.entries(monthlyExpenses)
                  .slice(0, 6)
                  .map(([month, amount]) => (
                    <div
                      key={month}
                      className="flex justify-between items-center"
                    >
                      <span className="text-sm text-gray-600">{month}</span>
                      <span className="font-medium">
                        ${(amount as number).toFixed(2)}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
