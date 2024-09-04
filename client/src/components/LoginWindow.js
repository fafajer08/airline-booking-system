function LoginWindow() {
    return (
        
        <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
            <div className="col-12 col-md-6"> {/* Makes the div 50% on medium screens and larger */}
                <div className="d-flex flex-column justify-content-center align-content-center">
                    <h2>Login Window</h2>
                    <form>
                        <label htmlFor="username">Username:</label><br />
                        <input type="text" id="username" name="username" className="form-control" required /><br />
                        <label htmlFor="password">Password:</label><br />
                        <input type="password" id="password" name="password" className="form-control" required /><br />
                        <input type="submit" value="Submit" className="btn btn-primary mt-3" />
                    </form>
                </div>
            </div>
        </div>
    );
    
}
export default LoginWindow;