import { observer } from "mobx-react-lite";
import { Button, Container, Menu } from "semantic-ui-react";
import { useStore } from "../stores/store";


export default observer( function Navbar() {

  const { activityStore } = useStore();
  const { openForm } = activityStore;

  return (
    <Menu inverted fixed='top'>
      <Container>
        <Menu.Item header>
          <img src="/assets/logo.png" alt="logo" style={{ marginRight: 10 }} />
          Reactivities
        </Menu.Item>
        <Menu.Item name="Activities" />
        <Menu.Item>
          <Button positive content='Create Activity' onClick={() => openForm()} />
        </Menu.Item>
      </Container>
    </Menu>
  )
});
