import { useEffect, useRef } from "react";
import { Form, useNavigation } from "react-router";

export default function CreateFrom() {

    const navigation = useNavigation();

    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
	
		if (navigation.state === 'idle') {
			formRef.current?.reset();
		}

	}, [navigation.state]);

    return (
        <Form
            ref={formRef}
            method="post"
            noValidate
            autoComplete="off"
            className="form create-form">
            <input type="hidden" name="operation" value="create" />
            <input className="form-input" name="task" maxLength={50} placeholder="Add a task" autoComplete="off"  />
            <button type='submit' className="btn btn-primary">CREATE</button>
        </Form>
    )
}
